import { z } from '@/app/utils/zod';

export const IngestDocumentsFailureSchema = z
  .object({
    external_id: z.string().meta({
      description: 'Document external id that failed ingest',
      example: 'doc_123',
    }),
    error: z.string().meta({
      description: 'Failure reason for this document',
      example: 'metadata: missing required property "category"',
    }),
  })
  .meta({
    title: 'IngestDocumentsFailure',
  });

export const IngestDocumentsResponseSchema = z
  .object({
    failed: z.array(IngestDocumentsFailureSchema).meta({
      description: 'Per-document failures from this ingest request',
    }),
  })
  .meta({
    title: 'IngestDocumentsResponse',
  });

export const IngestDocumentsErrorResponseSchema = z
  .object({
    error: z.string().meta({
      description: 'Error message',
      example: 'Request payload exceeds 16MB limit',
    }),
  })
  .meta({
    title: 'IngestDocumentsErrorResponse',
  });

export type IngestDocumentsFailure = z.infer<typeof IngestDocumentsFailureSchema>;
export type IngestDocumentsResponse = z.infer<typeof IngestDocumentsResponseSchema>;
