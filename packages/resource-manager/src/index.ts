import { PrismaClient } from 'database';

export type ProvisionedDatabase = {
  name: string;
  url: string;
};

export interface ResourceManager {
  provisionPgvectorDatabase(name: string): Promise<ProvisionedDatabase>;
}

export type PostgresResourceManagerConfig = {
  adminDatabaseUrl: string;
};

const DATABASE_NAME_PATTERN = /^[a-z][a-z0-9_]{0,62}$/;

export function ensureValidDatabaseName(name: string): void {
  if (!DATABASE_NAME_PATTERN.test(name)) {
    throw new Error('Invalid database name');
  }
}

export class PostgresResourceManager implements ResourceManager {
  constructor(private readonly config: PostgresResourceManagerConfig) {}

  async provisionPgvectorDatabase(name: string): Promise<ProvisionedDatabase> {
    ensureValidDatabaseName(name);

    const admin = new PrismaClient({
      datasourceUrl: this.config.adminDatabaseUrl,
    });

    try {
      await admin.$executeRawUnsafe(`CREATE DATABASE "${name}"`);
    } finally {
      await admin.$disconnect();
    }

    const url = buildDatabaseUrl(this.config.adminDatabaseUrl, name);
    const database = new PrismaClient({ datasourceUrl: url });

    try {
      await database.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector');
    } finally {
      await database.$disconnect();
    }

    return { name, url };
  }
}

function buildDatabaseUrl(baseUrl: string, databaseName: string): string {
  const url = new URL(baseUrl);
  url.pathname = `/${databaseName}`;
  return url.toString();
}
