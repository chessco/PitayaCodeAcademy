import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable()
export class FinanceService {
    constructor(private prisma: PrismaService) { }

    async getInstructorMetrics(tenantId: string, instructorId: string) {
        // Find instructor's courses
        const courses = await this.prisma.course.findMany({
            where: { tenantId, instructorId },
            select: { id: true }
        });
        const courseIds = courses.map((c: any) => c.id);

        if (courseIds.length === 0) {
            return {
                totalEarnings: 0,
                availableBalance: 0,
                monthlyIncome: 0,
                nextPayment: '15 Nov'
            };
        }

        // Total Earnings (Paid Orders)
        const totalRevenue = await this.prisma.orderItem.aggregate({
            where: {
                courseId: { in: courseIds },
                order: { status: 'PAID' }
            },
            _sum: { price: true }
        });

        // Monthly Income (Current Month)
        const startOfCurMonth = startOfMonth(new Date());
        const monthlyRevenue = await this.prisma.orderItem.aggregate({
            where: {
                courseId: { in: courseIds },
                order: {
                    status: 'PAID',
                    createdAt: { gte: startOfCurMonth }
                }
            },
            _sum: { price: true }
        });

        const total = Number(totalRevenue._sum.price || 0);
        return {
            totalEarnings: total,
            availableBalance: total * 0.7, // Mocking 70% share for instructor
            monthlyIncome: Number(monthlyRevenue._sum.price || 0),
            nextPayment: '15 Nov'
        };
    }

    async getIncomeTrend(instructorId: string) {
        const trend = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const label = format(date, 'MMM');
            // Mocking trend data for the chart
            trend.push({
                label,
                value: Math.floor(Math.random() * 5000) + 1000
            });
        }
        return trend;
    }

    async getCoursePerformance(instructorId: string) {
        const courses = await this.prisma.course.findMany({
            where: { instructorId },
            include: {
                _count: {
                    select: { enrollments: true }
                }
            }
        });

        return courses.map((c: any) => ({
            id: c.id,
            title: c.title,
            sales: c._count.enrollments,
            income: c._count.enrollments * 45, // Simulating average take
            refundRate: '1.2%'
        }));
    }

    async getTransactionHistory(instructorId: string) {
        return [
            { id: 'TRX-882910', date: '2023-10-15', concept: 'Pago Mensual - Octubre', amount: 1250, status: 'PAID' },
            { id: 'TRX-773102', date: '2023-09-15', concept: 'Pago Mensual - Septiembre', amount: 1100, status: 'PAID' },
            { id: 'REQ-991200', date: '2023-09-02', concept: 'Retiro Extraordinario', amount: 500, status: 'PROCESSING' }
        ];
    }
}
