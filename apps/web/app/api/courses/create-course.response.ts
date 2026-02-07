import { z } from '@/app/utils/zod';

export const CreateCourseResponseSchema = z
  .object({
    id: z.string().meta({
      description: 'Unique identifier for the course',
      example: 'ckv9f1p0w0000x8l0d6h0t1q2',
    }),
    name: z.string().min(1).meta({
      description: 'Course name',
      example: 'Algebra I',
    }),
    subject: z.string().min(1).meta({
      description: 'Course subject or category',
      example: 'Mathematics',
    }),
    createdById: z.string().meta({
      description: 'User id that created the course',
      example: 'ckv9f1p0w0000x8l0d6h0t1q2',
    }),
    createdAt: z.date().meta({
      description: 'Creation timestamp of the course',
      example: '2023-10-01T12:00:00Z',
    }),
    updatedById: z.string().meta({
      description: 'User id that last updated the course',
      example: 'ckv9f1p0w0000x8l0d6h0t1q2',
    }),
    updatedAt: z.date().meta({
      description: 'Last update timestamp of the course',
      example: '2023-10-01T12:00:00Z',
    }),
  })
  .meta({
    title: 'CreateCourseResponse',
  });

export const ErrorResponseSchema = z
  .object({
    error: z.string().meta({
      description: 'Error message',
      example: 'Unauthorized',
    }),
  })
  .meta({
    title: 'ErrorResponse',
  });

export type CreateCourseResponse = z.infer<typeof CreateCourseResponseSchema>;
