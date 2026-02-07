import Link from 'next/link';

import { ROUTES } from '@/app/routes';
import { Button } from '@/components/ui/button';

import type { FindIndexesResponse } from '@/app/api/indexes/find-indexes.response';
import { FindIndexesFacade } from '@/app/api/indexes/find-indexes.facade';

import { ErrorToast } from '@/components/error-toast';
import { IndexesList } from './indexes-list';

const DEFAULT_PAGE_SIZE = 25;

function getPageValue(pageParam?: string) {
  const pageNumber = Number(pageParam ?? '1');
  if (!Number.isFinite(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return Math.floor(pageNumber);
}

export default async function IndexesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = getPageValue(params?.page);
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  let data: FindIndexesResponse | null = null;
  let errorMessage: string | null = null;

  try {
    const facade = new FindIndexesFacade();
    data = await facade.find({
      skip,
      take: DEFAULT_PAGE_SIZE,
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unable to load indexes';
  }

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const buildPageHref = (targetPage: number) =>
    `${ROUTES.dashboard.indexes.home}?page=${targetPage}`;

  return (
    <div className="flex flex-col gap-6">
      <ErrorToast message={errorMessage} />
      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <IndexesList
        items={data?.items ?? []}
        totalCount={totalCount}
        page={page}
        pageSize={DEFAULT_PAGE_SIZE}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          {hasPrevious ? (
            <Button variant="outline" asChild>
              <Link href={buildPageHref(page - 1)}>Previous</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Previous
            </Button>
          )}
          {hasNext ? (
            <Button variant="outline" asChild>
              <Link href={buildPageHref(page + 1)}>Next</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
