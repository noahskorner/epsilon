import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateIndexRequestSchema } from '../indexes/create-index.request';
import {
  CreateIndexErrorResponseSchema,
  CreateIndexResponseSchema,
} from '../indexes/create-index.response';
import { FindIndexesResponseSchema } from '../indexes/find-indexes.response';

export async function GET() {
  const document = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'epsilon api docs',
      version: '1.0.0',
    },
    paths: {
      '/api/indexes': {
        get: {
          summary: 'Find indexes',
          tags: ['Indexes'],
          parameters: [
            {
              name: 'skip',
              in: 'query',
              required: false,
              description: 'Number of records to skip',
              schema: {
                type: 'integer',
                minimum: 0,
                default: 0,
                example: 0,
              },
            },
            {
              name: 'take',
              in: 'query',
              required: false,
              description: 'Number of records to return',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 25,
                example: 25,
              },
            },
          ],
          responses: {
            '200': {
              description: '200 OK',
              content: {
                'application/json': {
                  schema: FindIndexesResponseSchema,
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
