import { PRISMA } from '../../prisma';
import { CreateCourseRequest } from './create-course.request';
import { CreateCourseResponse } from './create-course.response';

export class CreateCourseFacade {
  public async create(
    request: CreateCourseRequest,
    userEmail: string
  ): Promise<CreateCourseResponse> {
    const user = await PRISMA.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      throw new Error('Unauthorized');
    }

    const course = await PRISMA.course.create({
      data: {
        name: request.name,
        subject: request.subject,
        createdById: user.id,
        updatedById: user.id,
      },
      select: {
        id: true,
        name: true,
        subject: true,
        createdById: true,
        createdAt: true,
        updatedById: true,
        updatedAt: true,
      },
    });

    return {
      id: course.id,
      name: course.name,
      subject: course.subject,
      createdById: course.createdById,
      createdAt: course.createdAt,
      updatedById: course.updatedById,
      updatedAt: course.updatedAt,
    } satisfies CreateCourseResponse;
  }
}
