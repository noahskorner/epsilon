'use client';

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const lightThemeHref =
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs.min.css';
    const darkThemeHref =
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css';

    const linkId = 'hljs-theme';

    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    link.href = resolvedTheme === 'dark' ? darkThemeHref : lightThemeHref;
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={theme ?? resolvedTheme ?? 'system'}
        onValueChange={(value) => setTheme(value)}
      >
        <DropdownMenuRadioItem value="light" className="flex items-center gap-2">
          <Sun className="size-4 text-muted-foreground" />
          <span>Light</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark" className="flex items-center gap-2">
          <Moon className="size-4 text-muted-foreground" />
          <span>Dark</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system" className="flex items-center gap-2">
          <Laptop className="size-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
};

export { ThemeSwitcher };
