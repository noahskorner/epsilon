import { PrismaClient } from 'database';
import { ENV } from 'environment';

export const PRISMA = new PrismaClient({
  datasourceUrl: ENV.DATABASE_URL,
});
