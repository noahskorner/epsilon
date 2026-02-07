import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import { PRISMA } from './prisma';
import { AuthOptions } from 'next-auth';
import { ENV } from 'environment';

export const AUTH: AuthOptions = {
  providers: [
    EmailProvider({
      server: ENV.EMAIL_SERVER,
      from: ENV.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(PRISMA),
  session: {
    strategy: 'database',
  },
};
