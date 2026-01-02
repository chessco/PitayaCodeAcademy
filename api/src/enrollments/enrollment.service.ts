import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
    constructor(private prisma: PrismaService) { }

    async enrollStudent(studentId: string, courseId: string) {
        // Check if already enrolled
        const existing = await this.prisma.enrollment.findUnique({
            where: {
                courseId_studentId: { courseId, studentId },
            },
        });

        if (existing) {
            return existing;
        }

        return this.prisma.enrollment.create({
            data: {
                studentId,
                courseId,
            },
        });
    }

    async getMyEnrollments(studentId: string) {
        return this.prisma.enrollment.findMany({
            where: { studentId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                        level: true,
                        description: true,
                        instructor: { include: { user: { select: { email: true, name: true } } } },
                    },
                },
            },
        });
    }

    async checkAccess(studentId: string, courseId: string) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                courseId_studentId: { courseId, studentId },
            },
        });
        return !!enrollment;
    }

    async getStudentsByCourse(courseId: string) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { courseId },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            },
        });

        // For now, return mock progress as the schema doesn't track lesson completion yet
        return enrollments.map((e: any) => ({
            id: e.id,
            studentId: e.studentId,
            name: e.student.user.name,
            email: e.student.user.email,
            avatar: e.student.avatarUrl,
            status: 'Activo', // Mock status
            progress: Math.floor(Math.random() * 100), // Mock progress
            completedLessons: Math.floor(Math.random() * 10), // Mock
            totalLessons: 12, // Mock from Studio.tsx
            lastAccess: 'Hace 2 horas', // Mock
            createdAt: e.createdAt,
        }));
    }
}
