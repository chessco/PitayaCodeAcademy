import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto, CreateLessonResourceDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
    constructor(private prisma: PrismaService) { }

    async findAllByCourse(courseId: string) {
        return this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async create(courseId: string, data: CreateLessonDto) {
        return this.prisma.lesson.create({
            data: {
                ...data,
                courseId,
            },
        });
    }

    async update(id: string, data: UpdateLessonDto) {
        return this.prisma.lesson.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.lesson.delete({
            where: { id },
        });
    }

    async reorder(lessonIds: string[]) {
        return this.prisma.$transaction(
            lessonIds.map((id, index) =>
                this.prisma.lesson.update({
                    where: { id },
                    data: { sortOrder: index },
                }),
            ),
        );
    }

    async addResource(lessonId: string, data: CreateLessonResourceDto) {
        return this.prisma.lessonResource.create({
            data: {
                ...data,
                lessonId,
            },
        });
    }

    async removeResource(id: string) {
        return this.prisma.lessonResource.delete({
            where: { id },
        });
    }
}
