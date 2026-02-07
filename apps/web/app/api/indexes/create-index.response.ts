import { z } from '@/app/utils/zod';

export const CreateIndexResponseSchema = z
  .object({
    id: z.string().meta({
      description: 'Primary identifier for the index',
      example: 'idx_9b0f3d1c',
    }),
    name: z.string().min(1).meta({
      description: 'Human-friendly index name',
      example: 'Support articles',
    }),
    dbName: z.string().min(1).meta({
      description: 'Provisioned database name',
      example: 'index_idx_9b0f3d1c',
    }),
    description: z.string().nullable().meta({
      description: 'Optional index description',
      example: 'Indexes support and troubleshooting documents.',
    }),
  })
  .meta({
    title: 'CreateIndexResponse',
  });

export const CreateIndexErrorResponseSchema = z
  .object({
    error: z.string().meta({
      description: 'Error message',
      example: 'Index name already exists',
    }),
  })
  .meta({
    title: 'CreateIndexErrorResponse',
  });

export type CreateIndexResponse = z.infer<typeof CreateIndexResponseSchema>;
