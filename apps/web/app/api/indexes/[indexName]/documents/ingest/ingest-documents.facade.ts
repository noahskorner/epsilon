import type { EventStorage } from 'event-storage';
import { PRISMA } from '@/app/prisma';

import type { IngestDocument } from './ingest-documents.request';
import { IngestDocumentSchema } from './ingest-documents.request';
import type { IngestDocumentsFailure, IngestDocumentsResponse } from './ingest-documents.response';
import { validateMetadataAgainstSchema } from './metadata-schema-validator';

const BATCH_SIZE = 100;
const DOCUMENTS_INGESTED_EVENT_TYPE = 'documents_ingested';
const UNKNOWN_EXTERNAL_ID = '<unknown>';

type DocumentsIngestedEvent = {
  type: typeof DOCUMENTS_INGESTED_EVENT_TYPE;
  batch_id: string;
  index_name: string;
};

type IngestPrismaClient = {
  documentIngestBatch: {
    create: (args: { data: { indexId: string }; select: { id: true } }) => Promise<{ id: string }>;
  };
  indexDocument: {
    upsert: (args: unknown) => Promise<unknown>;
  };
};

export class IngestDocumentsFacade {
  constructor(private readonly events: EventStorage<DocumentsIngestedEvent>) {}

  public async ingest(indexName: string, documents: unknown[]): Promise<IngestDocumentsResponse> {
    const prisma = PRISMA as unknown as IngestPrismaClient;

    const index = await PRISMA.index.findUnique({
      where: { name: indexName },
      select: { id: true, name: true },
    });

    if (!index) {
      throw new Error(`Index not found: ${indexName}`);
    }

    const failed: IngestDocumentsFailure[] = [];
    const validDocuments = this.validateDocuments(documents, failed);

    for (let offset = 0; offset < validDocuments.length; offset += BATCH_SIZE) {
      const batchDocuments = validDocuments.slice(offset, offset + BATCH_SIZE);
      const batch = await prisma.documentIngestBatch.create({
        data: { indexId: index.id },
        select: { id: true },
      });

      let persistedCount = 0;

      for (const document of batchDocuments) {
        try {
          await this.persistDocument(index.id, batch.id, document);
          persistedCount += 1;
        } catch (error) {
          failed.push({
            external_id: document.externalId,
            error: this.toErrorMessage(error),
          });
        }
      }

      if (persistedCount > 0) {
        await this.events.publishEvent({
          type: DOCUMENTS_INGESTED_EVENT_TYPE,
          batch_id: batch.id,
          index_name: index.name,
        });
      }
    }

    return { failed };
  }

  private validateDocuments(
    documents: unknown[],
    failed: IngestDocumentsFailure[]
  ): IngestDocument[] {
    const validDocuments: IngestDocument[] = [];

    for (const document of documents) {
      const parsedDocument = IngestDocumentSchema.safeParse(document);

      if (!parsedDocument.success) {
        failed.push({
          external_id: this.readExternalId(document),
          error: parsedDocument.error.issues.map((issue) => issue.message).join('; '),
        });
        continue;
      }

      const metadataValidationError = validateMetadataAgainstSchema(
        parsedDocument.data.metadata,
        parsedDocument.data.schema
      );

      if (metadataValidationError) {
        failed.push({
          external_id: parsedDocument.data.externalId,
          error: metadataValidationError,
        });
        continue;
      }

      validDocuments.push(parsedDocument.data);
    }

    return validDocuments;
  }

  private async persistDocument(
    indexId: string,
    batchId: string,
    document: IngestDocument
  ): Promise<void> {
    const prisma = PRISMA as unknown as IngestPrismaClient;

    await prisma.indexDocument.upsert({
      where: {
        indexId_externalId: {
          indexId,
          externalId: document.externalId,
        },
      },
      create: {
        indexId,
        externalId: document.externalId,
        schema: document.schema,
        title: document.title,
        context: document.context ?? null,
        contentType: document.contentType,
        content: document.content,
        searchTitle: document.views?.search?.title ?? null,
        searchContext: document.views?.search?.context ?? null,
        searchContentType: document.views?.search?.contentType ?? null,
        searchContent: document.views?.search?.content ?? null,
        agentTitle: document.views?.agent?.title ?? null,
        agentContext: document.views?.agent?.context ?? null,
        agentContentType: document.views?.agent?.contentType ?? null,
        agentContent: document.views?.agent?.content ?? null,
        dimensions: document.dimensions,
        chunkSize: document.chunkSize,
        overlapSize: document.overlapSize,
        metadata: document.metadata,
        batchId,
      },
      update: {
        schema: document.schema,
        title: document.title,
        context: document.context ?? null,
        contentType: document.contentType,
        content: document.content,
        searchTitle: document.views?.search?.title ?? null,
        searchContext: document.views?.search?.context ?? null,
        searchContentType: document.views?.search?.contentType ?? null,
        searchContent: document.views?.search?.content ?? null,
        agentTitle: document.views?.agent?.title ?? null,
        agentContext: document.views?.agent?.context ?? null,
        agentContentType: document.views?.agent?.contentType ?? null,
        agentContent: document.views?.agent?.content ?? null,
        dimensions: document.dimensions,
        chunkSize: document.chunkSize,
        overlapSize: document.overlapSize,
        metadata: document.metadata,
        batchId,
      },
    });
  }

  private readExternalId(document: unknown): string {
    if (typeof document !== 'object' || document === null || Array.isArray(document)) {
      return UNKNOWN_EXTERNAL_ID;
    }

    const value = (document as Record<string, unknown>).external_id;
    return typeof value === 'string' && value.length > 0 ? value : UNKNOWN_EXTERNAL_ID;
  }

  private toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
