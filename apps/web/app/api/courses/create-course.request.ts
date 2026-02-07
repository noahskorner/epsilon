import { z } from '@/app/utils/zod';

export const CreateCourseRequestSchema = z
  .object({
    name: z.string().min(1).meta({
      description: 'Course name',
      example: 'Algebra I',
    }),
    subject: z.string().min(1).meta({
      description: 'Course subject or category',
      example: 'Mathematics',
    }),
  })
  .meta({
    title: 'CreateCourseRequest',
  });

export type CreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;
