import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourceService {
    constructor(private prisma: PrismaService) { }

    async findAllByCourse(courseId: string) {
        return this.prisma.courseResource.findMany({
            where: { courseId },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async create(courseId: string, data: { title: string, url: string, fileSize?: string, fileType?: string, lessonId?: string }) {
        return this.prisma.courseResource.create({
            data: {
                ...data,
                courseId
            }
        });
    }

    async update(id: string, data: { title?: string, isVisible?: boolean, lessonId?: string | null }) {
        return this.prisma.courseResource.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return this.prisma.courseResource.delete({
            where: { id }
        });
    }
}
