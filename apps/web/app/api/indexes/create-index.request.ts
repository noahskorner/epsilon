import { z } from '@/app/utils/zod';

export const CreateIndexRequestSchema = z
  .object({
    name: z.string().min(1).meta({
      description: 'Human-friendly index name (unique)',
      example: 'Support articles',
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
