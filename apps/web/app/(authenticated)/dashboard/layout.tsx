import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { AUTH } from '@/app/auth';
import { ROUTES } from '@/app/routes';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { Header } from './header';
import { Sidebar } from './sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(AUTH);
  const email = session?.user?.email;
  if (email == null) {
    return redirect(ROUTES.signIn);
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const initials = email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join('');

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />
      <SidebarInset className="md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
        <Header email={email} initials={initials} />
        <div className="flex flex-1 flex-col px-4 py-6 md:px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
