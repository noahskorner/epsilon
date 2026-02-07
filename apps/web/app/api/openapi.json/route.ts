import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateIndexRequestSchema } from '../indexes/create-index.request';
import {
  CreateIndexErrorResponseSchema,
  CreateIndexResponseSchema,
} from '../indexes/create-index.response';

export async function GET() {
  const document = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'epsilon api docs',
      version: '1.0.0',
    },
    paths: {
      '/api/indexes': {
        post: {
          summary: 'Create index',
          tags: ['Indexes'],
          requestBody: {
            content: {
              'application/json': { schema: CreateIndexRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
              content: {
                'application/json': {
                  schema: CreateIndexResponseSchema,
                },
              },
            },
            '400': {
              description: '400 Bad Request',
              content: {
                'application/json': {
                  schema: CreateIndexErrorResponseSchema,
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
