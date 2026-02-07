import { z } from '@/app/utils/zod';

import { PagedResult } from '../paged-result';

export const IndexSummarySchema = z
  .object({
    id: z.string().meta({
      description: 'Primary identifier for the index',
      example: 'b2af6f7e-3c6a-4d86-96d2-5e1b9f9d63e5',
    }),
    name: z.string().min(1).meta({
      description: 'Human-friendly index name',
      example: 'Support articles',
    }),
    dbName: z.string().min(1).meta({
      description: 'Provisioned database name',
      example: 'index_support_articles',
    }),
    description: z.string().nullable().meta({
      description: 'Optional index description',
      example: 'Indexes support and troubleshooting documents.',
    }),
  })
  .meta({
    title: 'IndexSummary',
  });

export const FindIndexesResponseSchema = z
  .object({
    totalCount: z.number().int().min(0).meta({
      description: 'Total number of indexes available',
      example: 42,
    }),
    items: z.array(IndexSummarySchema).meta({
      description: 'Page of indexes',
    }),
  })
  .meta({
    title: 'FindIndexesResponse',
  });

export type IndexSummary = z.infer<typeof IndexSummarySchema>;
export type FindIndexesResponse = PagedResult<IndexSummary>;
