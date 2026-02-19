import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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

    async enrollByEmail(email: string, courseId: string, tenantId: string) {
        // Find existing membership in this tenant for the user with this email
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                memberships: {
                    where: { tenantId }
                }
            }
        });

        if (!user) {
            throw new ConflictException('El usuario no existe en la plataforma. Debe registrarse primero.');
        }

        const membership = user.memberships[0];

        if (!membership) {
            throw new ConflictException('El usuario existe pero no es miembro de esta academia.');
        }

        return this.enrollStudent(membership.id, courseId);
    }

    async getMyEnrollments(studentId: string) {
        const enrollments = await this.prisma.enrollment.findMany({
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
                        _count: { select: { lessons: true } }
                    },
                },
                completedLessons: true,
            },
            orderBy: {
                lastAccessedAt: 'desc',
            },
        });

        return enrollments.map((enrollment: any) => {
            const completedCount = enrollment.completedLessons?.length || 0;
            const totalLessons = enrollment.course._count?.lessons || 0;
            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            return {
                ...enrollment,
                progress
            };
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

    async getProgress(studentId: string, courseId: string) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                courseId_studentId: { courseId, studentId },
            },
            include: {
                completedLessons: true,
            },
        });

        if (!enrollment) return null;

        // Update last accessed time
        await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { lastAccessedAt: new Date() }
        });

        return {
            completedLessonIds: enrollment.completedLessons.map((l: any) => l.lessonId),
        };
    }

    async markLessonComplete(studentId: string, courseId: string, lessonId: string) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                courseId_studentId: { courseId, studentId },
            },
        });

        if (!enrollment) {
            throw new NotFoundException('Inscripción no encontrada');
        }

        // Update last accessed time
        await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { lastAccessedAt: new Date() }
        });

        // Check if already completed using type casting for new model
        const existing = await this.prisma.lessonProgress.findUnique({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId: enrollment.id,
                    lessonId,
                },
            },
        });

        if (existing) return existing;

        return this.prisma.lessonProgress.create({
            data: {
                enrollmentId: enrollment.id,
                lessonId,
            },
        });
    }
}
