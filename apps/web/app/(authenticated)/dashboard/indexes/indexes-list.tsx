import Link from 'next/link';

import { ROUTES } from '@/app/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { IndexSummary } from '@/app/api/indexes/find-indexes.response';

interface IndexesListProps {
  items: IndexSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function IndexesList({ items, totalCount, page, pageSize }: IndexesListProps) {
  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Search indexes</CardTitle>
            <CardDescription>
              Manage index configurations, data sources, and ingestion settings.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href={ROUTES.dashboard.indexes.new}>Create index</Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Showing {startIndex}-{endIndex} of {totalCount} indexes
          </span>
          <Badge variant="secondary">Page size: {pageSize}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No indexes yet. Create one to start ingesting data.
          </div>
        ) : (
          items.map((index, indexPosition) => (
            <div key={index.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{index.name}</p>
                  <p className="text-sm text-muted-foreground">{index.description ?? 'No description'}</p>
                </div>
                <Badge variant="outline">{index.dbName}</Badge>
              </div>
              {indexPosition < items.length - 1 ? <Separator /> : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
