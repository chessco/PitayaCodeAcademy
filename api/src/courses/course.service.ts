import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string, filter?: { instructorId?: string; isPublished?: boolean; skip?: number; take?: number }) {
        const where: any = { tenantId };
        if (filter?.instructorId) where.instructorId = filter.instructorId;
        if (filter?.isPublished !== undefined) where.isPublished = filter.isPublished;

        const [items, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                skip: filter?.skip,
                take: filter?.take,
                orderBy: { createdAt: 'desc' },
                include: {
                    instructor: { include: { user: { select: { email: true, name: true } } } },
                    _count: {
                        select: { lessons: true, enrollments: true }
                    }
                },
            }),
            this.prisma.course.count({ where })
        ]);

        return { items, total };
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { sortOrder: 'asc' },
                            include: { resources: true }
                        },
                    },
                },
                lessons: {
                    where: { moduleId: null },
                    orderBy: { sortOrder: 'asc' },
                    include: { resources: true }
                },
                instructor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async create(tenantId: string, instructorId: string, data: CreateCourseDto) {
        try {
            return await this.prisma.course.create({
                data: {
                    ...data,
                    tenantId,
                    instructorId,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Ya existe un curso con este slug. Por favor usa un título o identificador diferente.');
            }
            throw error;
        }
    }

    async update(id: string, data: UpdateCourseDto) {
        return this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        // Check for active enrollments
        const enrollmentsCount = await this.prisma.enrollment.count({
            where: { courseId: id }
        });

        if (enrollmentsCount > 0) {
            throw new ConflictException('No se puede eliminar el curso porque tiene estudiantes inscritos. Por favor, deshabilítalo (cambia estado a Borrador) para ocultarlo del catálogo público.');
        }

        try {
            // Delete related resources first if cascading is not set up in DB
            // However, Prisma usually handles this if relations are set to cascade, or we might need to manually delete
            // For now, let's try delete and let Prisma throw if constraint fails
            return await this.prisma.course.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new ConflictException('No se puede eliminar el curso debido a dependencias en la base de datos (recursos, lecciones, etc.).');
            }
            throw error;
        }
    }
}
