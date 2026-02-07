import { z } from '@/app/utils/zod';

export const CreateIndexRequestSchema = z
  .object({
    id: z.string().min(1).meta({
      description: 'Client-supplied primary key for the index',
      example: 'idx_9b0f3d1c',
    }),
    name: z.string().min(1).meta({
      description: 'Human-friendly index name (unique)',
      example: 'Support articles',
    }),
    dbName: z.string().optional().meta({
      description: 'System-generated database name (ignored if provided)',
      example: 'index_idx_9b0f3d1c',
    }),
    description: z.string().max(500).optional().meta({
      description: 'Optional description of the index',
      example: 'Indexes support and troubleshooting documents.',
    }),
  })
  .meta({
    title: 'CreateIndexRequest',
  });

export type CreateIndexRequest = z.infer<typeof CreateIndexRequestSchema>;
