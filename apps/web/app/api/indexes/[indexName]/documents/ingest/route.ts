import { Buffer } from 'node:buffer';

import { NextRequest, NextResponse } from 'next/server';

import { IngestDocumentsFacade } from './ingest-documents.facade';
import {
  IngestDocumentsEnvelopeSchema,
  IngestDocumentsParamsSchema,
} from './ingest-documents.request';
import { createServiceScope, SERVICE_TOKENS } from '@/app/services';

const MAX_REQUEST_BYTES = 16 * 1024 * 1024;

type RouteContext = {
  params: Promise<{ indexName: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const rawBody = await req.text();
    const requestSize = Buffer.byteLength(rawBody, 'utf8');

    if (requestSize > MAX_REQUEST_BYTES) {
      throw new Error('Request payload exceeds 16MB limit');
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      throw new Error('Invalid JSON body');
    }

    const { documents } = IngestDocumentsEnvelopeSchema.parse(body);
    const params = IngestDocumentsParamsSchema.parse(await context.params);
    const services = createServiceScope();
    const facade = new IngestDocumentsFacade(services.resolve(SERVICE_TOKENS.eventStorage));
    const response = await facade.ingest(params.indexName, documents);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.startsWith('Index not found:') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
