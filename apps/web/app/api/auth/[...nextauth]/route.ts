import { AUTH } from '@/app/auth';
import NextAuth from 'next-auth';

const handler = NextAuth(AUTH);
export { handler as GET, handler as POST };
