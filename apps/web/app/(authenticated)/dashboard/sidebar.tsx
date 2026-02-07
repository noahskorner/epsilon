import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Brain,
  FlaskConical,
  LayoutDashboard,
  MessageSquareText,
  Rocket,
  Settings,
  Sparkles,
} from 'lucide-react';

import { ROUTES } from '@/app/routes';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const NAV_SECTIONS: SidebarSection[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: ROUTES.dashboard.home,
        active: true,
      },
      {
        label: 'Execution runs',
        icon: Rocket,
      },
    ],
  },
  {
    label: 'Experiments',
    items: [
      {
        label: 'A/B tests',
        icon: FlaskConical,
      },
      {
        label: 'Agent variants',
        icon: Brain,
      },
      {
        label: 'Evaluations',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Conversations',
    items: [
      {
        label: 'Sessions',
        icon: MessageSquareText,
      },
      {
        label: 'Memory strategies',
        icon: Brain,
      },
    ],
  },
];

export function Sidebar() {
  return (
    <SidebarComponent collapsible="icon" variant="inset">
      <SidebarHeader>
        <div
          className="flex items-center justify-between gap-2 rounded-lg border
            border-sidebar-border/70 bg-sidebar/40 px-2 py-2
            group-data-[collapsible=icon]:justify-center
            group-data-[collapsible=icon]:px-1.5
            group-data-[collapsible=icon]:py-1.5
            group-data-[collapsible=icon]:border-none
            "
        >
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0">
            <div
              className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground
                shadow-sm group-data-[collapsible=icon]:size-8 shrink-0"
            >
              <Sparkles className="size-4" />
            </div>
            <div className="leading-tight group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold">epsilon</p>
              <p className="text-xs text-sidebar-foreground/70">AI agent platform</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="hidden text-[10px] uppercase tracking-wide md:flex group-data-[collapsible=icon]:hidden"
          >
            Beta
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    {item.href ? (
                      <SidebarMenuButton asChild isActive={item.active}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton disabled aria-disabled="true">
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled aria-disabled="true">
              <Settings />
              <span>Workspace Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
