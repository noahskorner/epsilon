'use server';

import { revalidatePath } from 'next/cache';

import { CreateIndexFacade } from '@/app/api/indexes/create-index.facade';
import { CreateIndexRequestSchema } from '@/app/api/indexes/create-index.request';
import { type CreateIndexResponse } from '@/app/api/indexes/create-index.response';
import { ROUTES } from '@/app/routes';
import { createServiceScope, SERVICE_TOKENS } from '@/app/services';

export type CreateIndexActionResult =
  | { status: 'success'; data: CreateIndexResponse }
  | { status: 'error'; message: string };

export async function createIndexAction(input: unknown): Promise<CreateIndexActionResult> {
  try {
    const payload = CreateIndexRequestSchema.parse(input);
    const description = payload.description?.trim();
    const services = createServiceScope();
    const facade = new CreateIndexFacade(services.resolve(SERVICE_TOKENS.resourceManager));

    const response = await facade.create({
      ...payload,
      description: description && description.length > 0 ? description : undefined,
    });

    revalidatePath(ROUTES.dashboard.indexes.home);

    return { status: 'success', data: response };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create index';
    return { status: 'error', message };
  }
}
