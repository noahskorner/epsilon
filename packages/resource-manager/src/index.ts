import { PrismaClient } from 'database';
import { ENV } from 'environment';

export type ProvisionedDatabase = {
  name: string;
  url: string;
};

const DATABASE_NAME_PATTERN = /^[a-z][a-z0-9_]{0,62}$/;

export function ensureValidDatabaseName(name: string): void {
  if (!DATABASE_NAME_PATTERN.test(name)) {
    throw new Error('Invalid database name');
  }
}

export async function provisionPgvectorDatabase(name: string): Promise<ProvisionedDatabase> {
  ensureValidDatabaseName(name);

  const admin = new PrismaClient({
    datasourceUrl: ENV.RESOURCE_MANAGER_DATABASE_URL,
  });

  try {
    await admin.$executeRawUnsafe(`CREATE DATABASE "${name}"`);
  } finally {
    await admin.$disconnect();
  }

  const url = buildDatabaseUrl(ENV.RESOURCE_MANAGER_DATABASE_URL, name);
  const database = new PrismaClient({ datasourceUrl: url });

  try {
    await database.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector');
  } finally {
    await database.$disconnect();
  }

  return { name, url };
}

function buildDatabaseUrl(baseUrl: string, databaseName: string): string {
  const url = new URL(baseUrl);
  url.pathname = `/${databaseName}`;
  return url.toString();
}
