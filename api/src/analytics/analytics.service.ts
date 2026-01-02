import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getInstructorMetrics(tenantId: string, instructorId: string) {
        // Find instructor's courses
        const courses = await this.prisma.course.findMany({
            where: { tenantId, instructorId },
            select: { id: true }
        });
        const courseIds = courses.map((c: { id: string }) => c.id);

        if (courseIds.length === 0) {
            return {
                totalRevenue: 0,
                activeStudents: 0,
                avgCompletion: 0,
                avgRating: 0
            };
        }

        // Sum revenue from PAID orders
        const revenue = await this.prisma.orderItem.aggregate({
            where: {
                courseId: { in: courseIds },
                order: { status: 'PAID' }
            },
            _sum: { price: true }
        });

        // Count unique students enrolled
        const studentCount = await this.prisma.enrollment.groupBy({
            by: ['studentId'],
            where: { courseId: { in: courseIds } }
        });

        // Average Rating
        const rating = await this.prisma.review.aggregate({
            where: { courseId: { in: courseIds } },
            _avg: { rating: true }
        });

        return {
            totalRevenue: Number(revenue._sum.price || 0),
            activeStudents: studentCount.length,
            avgCompletion: 78, // Mock as progress isn't fully tracked in schema yet
            avgRating: Number((rating._avg.rating || 4.8).toFixed(1))
        };
    }

    async getParticipationData(instructorId: string) {
        // Daily enrollments last 30 days
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const label = format(date, 'dd MMM');
            // Simplified count for graph
            data.push({
                label,
                value: Math.floor(Math.random() * 50) + 10 // Mock dynamic data for now
            });
        }
        return data;
    }

    async getTopDropoutLessons(instructorId: string) {
        // Mock data as progress/dropout isn't yet in schema
        return [
            { module: 'Módulo 3: Configuración de Webpack', abandonment: 42, course: 'Javascript Moderno', studentsAffected: 342 },
            { module: 'Intro a Redux Toolkit', abandonment: 28, course: 'React Avanzado', studentsAffected: 120 },
            { module: 'Autenticación con JWT', abandonment: 15, course: 'Fullstack Pro', studentsAffected: 85 }
        ];
    }

    async getCouponPerformance(instructorId: string) {
        // Mock based on coupon schema
        return [
            { code: 'VERANO2024', discount: '20% OFF', uses: 142, revenue: 1240 },
            { code: 'REACT_MASTER', discount: '15% OFF', uses: 89, revenue: 890 },
            { code: 'ESTUDIANTE', discount: '50% OFF', uses: 34, revenue: 170 }
        ];
    }
}
