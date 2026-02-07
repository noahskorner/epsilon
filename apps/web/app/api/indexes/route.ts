import { NextRequest, NextResponse } from 'next/server';

import { CreateIndexFacade } from './create-index.facade';
import { CreateIndexRequestSchema } from './create-index.request';
import { FindIndexesFacade } from './find-indexes.facade';
import { FindIndexesRequestSchema } from './find-indexes.request';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const request = CreateIndexRequestSchema.parse(body);
    const facade = new CreateIndexFacade();
    const response = await facade.create(request);

    return NextResponse.json(response, {
      status: 201,
      headers: {
        Location: `/indexes/${response.id}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const request = FindIndexesRequestSchema.parse(query);
    const facade = new FindIndexesFacade();
    const response = await facade.find(request);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
