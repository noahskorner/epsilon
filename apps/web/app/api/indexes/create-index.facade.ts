import { PRISMA } from '@/app/prisma';
import type { ResourceManager } from 'resource-manager';

import { CreateIndexRequest } from './create-index.request';
import { CreateIndexResponse } from './create-index.response';

const DATABASE_NAME_PREFIX = 'index';
const MAX_DATABASE_NAME_LENGTH = 63;

export class CreateIndexFacade {
  constructor(private readonly resourceManager: ResourceManager) {}

  public async create(request: CreateIndexRequest): Promise<CreateIndexResponse> {
    await this.ensureNameAvailable(request.name);
    const dbName = this.toDatabaseName(request.name);
    await this.ensureDbNameAvailable(dbName);

    const index = await PRISMA.index.create({
      data: {
        name: request.name,
        dbName,
        description: request.description ?? null,
      },
      select: {
        id: true,
        name: true,
        dbName: true,
        description: true,
      },
    });

    await this.resourceManager.provisionPgvectorDatabase(dbName);

    return {
      id: index.id,
      name: index.name,
      dbName: index.dbName,
      description: index.description,
    } satisfies CreateIndexResponse;
  }

  private async ensureNameAvailable(name: string): Promise<void> {
    const existing = await PRISMA.index.findUnique({
      where: { name },
      select: { id: true },
    });

    if (existing) {
      throw new Error('Index name already exists');
    }
  }

  private async ensureDbNameAvailable(dbName: string): Promise<void> {
    const existing = await PRISMA.index.findUnique({
      where: { dbName },
      select: { id: true },
    });

    if (existing) {
      throw new Error('Index database name already exists');
    }
  }

  private toDatabaseName(value: string): string {
    const normalized = value
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const suffix = normalized.length > 0 ? normalized : 'id';
    let name = `${DATABASE_NAME_PREFIX}_${suffix}`;

    if (name.length > MAX_DATABASE_NAME_LENGTH) {
      name = name.slice(0, MAX_DATABASE_NAME_LENGTH);
    }

    return name;
  }
}
