import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        // Automatically filtered by tenantId via PrismaService extension
        return this.prisma.course.findMany({
            include: {
                instructor: { include: { user: { select: { email: true } } } },
            },
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async create(instructorId: string, data: CreateCourseDto) {
        return this.prisma.course.create({
            data: {
                ...data,
                instructorId,
            },
        });
    }

    async update(id: string, data: UpdateCourseDto) {
        return this.prisma.course.update({
            where: { id },
            data,
        });
    }
}
