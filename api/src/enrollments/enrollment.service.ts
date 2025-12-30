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
                        title: true,
                        slug: true,
                        instructor: { include: { user: { select: { email: true } } } },
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
}
