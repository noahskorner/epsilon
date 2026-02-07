import { LogOut, Settings } from 'lucide-react';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  email: string;
  initials: string;
};

export function Header({ email, initials }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4
          backdrop-blur md:px-6"
    >
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="size-7">
                  <AvatarFallback>{initials || 'DT'}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline">{email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-1">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                  Signed in as
                </span>
                <span className="block truncate text-sm font-medium">{email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ThemeSwitcher />
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
