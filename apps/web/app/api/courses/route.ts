import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { AUTH } from '@/app/auth';

import { CreateCourseFacade } from './create-course.facade';
import { CreateCourseRequestSchema } from './create-course.request';

export async function POST(req: NextRequest) {
  const session = await getServerSession(AUTH);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const request = CreateCourseRequestSchema.parse(body);
    const facade = new CreateCourseFacade();
    const response = await facade.create(request, userEmail);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
