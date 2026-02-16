import { z } from '@/app/utils/zod';

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonSchema = JsonObject | boolean;

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    JsonObjectSchema,
  ])
);

const JsonObjectSchema: z.ZodType<JsonObject> = z.record(z.string(), JsonValueSchema);

export const IngestDocumentViewSchema = z
  .object({
    title: z.string().min(1).optional().meta({
      description: 'Optional view-specific title override',
      example: 'Troubleshooting authentication failures',
    }),
    context: z.string().optional().meta({
      description: 'Optional view-specific context override',
      example: 'Internal runbook optimized for search',
    }),
    contentType: z.string().min(1).optional().meta({
      description: 'Optional view-specific content MIME type override',
      example: 'text/plain',
    }),
    content: z.string().min(1).optional().meta({
      description: 'Optional view-specific content override',
      example: 'Step 1: Verify provider credentials...',
    }),
  })
  .meta({
    title: 'IngestDocumentView',
  });

export const IngestDocumentSchema = z
  .object({
    externalId: z.string().min(1).meta({
      description: 'Unique identifier for the document within the index',
      example: 'doc_123',
    }),
    schema: z.union([z.boolean(), JsonObjectSchema]).meta({
      description: 'JSON Schema used to validate metadata',
      example: {
        type: 'object',
        required: ['category'],
        properties: {
          category: { type: 'string' },
        },
      },
    }),
    title: z.string().min(1).meta({
      description: 'Human-readable title for the document',
      example: 'Authentication troubleshooting guide',
    }),
    context: z.string().optional().meta({
      description: 'Optional additional context for the document',
      example: 'Source: internal wiki article',
    }),
    contentType: z.string().min(1).meta({
      description: 'MIME type of the content payload',
      example: 'text/plain',
    }),
    content: z.string().min(1).meta({
      description: 'Raw document content',
      example: 'If authentication fails, start by checking...',
    }),
    views: z
      .object({
        search: IngestDocumentViewSchema.optional().meta({
          description: 'Search-optimized view overrides',
        }),
        agent: IngestDocumentViewSchema.optional().meta({
          description: 'Agent-optimized view overrides',
        }),
      })
      .optional()
      .meta({
        description: 'Optional view-specific content overrides',
      }),
    dimensions: z.number().int().min(1).default(1536).meta({
      description: 'Embedding dimensions for this document',
      example: 1536,
    }),
    chunkSize: z.number().int().min(1).default(800).meta({
      description: 'Chunk size in tokens',
      example: 800,
    }),
    overlapSize: z.number().int().min(0).default(100).meta({
      description: 'Token overlap between adjacent chunks',
      example: 100,
    }),
    metadata: JsonObjectSchema.meta({
      description: 'Structured metadata validated against schema',
      example: {
        category: 'auth',
        language: 'en',
      },
    }),
  })
  .superRefine((value, context) => {
    if (value.overlapSize >= value.chunkSize) {
      context.addIssue({
        code: 'custom',
        path: ['overlapSize'],
        message: 'overlapSize must be less than chunkSize',
      });
    }
  })
  .meta({
    title: 'IngestDocument',
  });

export const IngestDocumentsEnvelopeSchema = z
  .object({
    documents: z.array(z.unknown()).min(1).max(1000).meta({
      description: 'Documents to ingest (max 1000 per request)',
    }),
  })
  .meta({
    title: 'IngestDocumentsEnvelope',
  });

export const IngestDocumentsRequestSchema = z
  .object({
    documents: z.array(IngestDocumentSchema).min(1).max(1000).meta({
      description: 'Documents to ingest (max 1000 per request)',
    }),
  })
  .meta({
    title: 'IngestDocumentsRequest',
  });

export const IngestDocumentsParamsSchema = z
  .object({
    indexName: z.string().min(1).meta({
      description: 'Index name used in the ingest URL path',
      example: 'support_articles',
    }),
  })
  .meta({
    title: 'IngestDocumentsParams',
  });

export type IngestDocument = z.infer<typeof IngestDocumentSchema>;
export type IngestDocumentsRequest = z.infer<typeof IngestDocumentsRequestSchema>;
export type IngestDocumentsParams = z.infer<typeof IngestDocumentsParamsSchema>;
