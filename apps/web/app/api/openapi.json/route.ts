import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateAssetRequestSchema } from '../assets/create-asset.request';
import { CreateAssetResponseSchema } from '../assets/create-asset.response';
import { CreateCourseRequestSchema } from '../courses/create-course.request';
import {
  CreateCourseResponseSchema,
  ErrorResponseSchema,
} from '../courses/create-course.response';

export async function GET() {
  const document = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'epsilon api docs',
      version: '1.0.0',
    },
    paths: {
      '/api/assets': {
        post: {
          summary: 'Create asset',
          tags: ['Assets'],
          requestBody: {
            content: {
              'application/json': { schema: CreateAssetRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
              content: {
                'application/json': {
                  schema: CreateAssetResponseSchema,
                },
              },
            },
          },
        },
      },
      '/api/courses': {
        post: {
          summary: 'Create course',
          tags: ['Courses'],
          requestBody: {
            content: {
              'application/json': { schema: CreateCourseRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
              content: {
                'application/json': {
                  schema: CreateCourseResponseSchema,
                },
              },
            },
            '400': {
              description: '400 Bad Request',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '401': {
              description: '401 Unauthorized',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(document);
}
