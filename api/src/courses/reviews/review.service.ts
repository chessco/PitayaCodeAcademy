import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService) { }

    async createOrUpdateReview(studentId: string, data: { courseId: string; rating: number; comment?: string; pros?: string; contras?: string }) {
        // Verify enrollment
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                courseId_studentId: {
                    courseId: data.courseId,
                    studentId: studentId,
                },
            },
        });

        if (!enrollment) {
            throw new BadRequestException('Student is not enrolled in this course');
        }

        return this.prisma.review.upsert({
            where: {
                courseId_studentId: {
                    courseId: data.courseId,
                    studentId: studentId,
                },
            },
            update: {
                rating: data.rating,
                comment: data.comment,
                pros: data.pros,
                contras: data.contras,
            },
            create: {
                courseId: data.courseId,
                studentId: studentId,
                rating: data.rating,
                comment: data.comment,
                pros: data.pros,
                contras: data.contras,
            },
        });
    }

    async getCourseReviewSummary(courseId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { courseId },
            select: { rating: true },
        });

        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            };
        }

        const totalReviews = reviews.length;
        const sumRatings = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
        const averageRating = parseFloat((sumRatings / totalReviews).toFixed(1));

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r: any) => {
            const rating = r.rating as 1 | 2 | 3 | 4 | 5;
            if (distribution[rating] !== undefined) {
                distribution[rating]++;
            }
        });

        return {
            averageRating,
            totalReviews,
            distribution,
        };
    }

    async getMyReview(studentId: string, courseId: string) {
        return this.prisma.review.findUnique({
            where: {
                courseId_studentId: {
                    courseId,
                    studentId,
                },
            },
        });
    }

    async getReviewsByStudent(studentId: string) {
        return this.prisma.review.findMany({
            where: { studentId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
