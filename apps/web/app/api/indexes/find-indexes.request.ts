import { z } from '@/app/utils/zod';

export const FindIndexesRequestSchema = z
  .object({
    skip: z.coerce.number().int().min(0).default(0).meta({
      description: 'Number of records to skip',
      example: 0,
    }),
    take: z.coerce.number().int().min(1).default(10).meta({
      description: 'Number of records to return',
      example: 10,
    }),
  })
  .meta({
    title: 'FindIndexesRequest',
  });

export type FindIndexesRequest = z.infer<typeof FindIndexesRequestSchema>;
