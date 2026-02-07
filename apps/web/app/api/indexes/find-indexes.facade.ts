import { PRISMA } from '@/app/prisma';

import { PagedResult } from '../paged-result';
import { FindIndexesRequest } from './find-indexes.request';
import { IndexSummary } from './find-indexes.response';

export class FindIndexesFacade {
  public async find(request: FindIndexesRequest): Promise<PagedResult<IndexSummary>> {
    const [totalCount, items] = await Promise.all([
      PRISMA.index.count(),
      PRISMA.index.findMany({
        skip: request.skip,
        take: request.take,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          dbName: true,
          description: true,
        },
      }),
    ]);

    return {
      totalCount,
      items,
    };
  }
}
