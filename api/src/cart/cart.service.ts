import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async createOrder(studentId: string, courseIds: string[]) {
        if (courseIds.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const courses = await this.prisma.client.course.findMany({
            where: { id: { in: courseIds } },
        });

        const totalAmount = courses.reduce((sum: number, course: any) => sum + Number(course.price), 0);

        return this.prisma.client.order.create({
            data: {
                studentId,
                totalAmount,
                status: 'PENDING',
                items: {
                    create: courses.map((course: any) => ({
                        courseId: course.id,
                        price: course.price,
                    })),
                },
            },
            include: { items: true },
        });
    }

    async fulfillOrder(orderId: string) {
        // Note: We use the base client for transactions to ensure type safety with $transaction
        return this.prisma.client.$transaction(async (tx: any) => {
            const order = await tx.order.update({
                where: { id: orderId },
                data: { status: 'PAID' },
                include: { items: true },
            });

            for (const item of order.items) {
                await tx.enrollment.upsert({
                    where: {
                        courseId_studentId: {
                            courseId: item.courseId,
                            studentId: order.studentId,
                        },
                    },
                    update: {},
                    create: {
                        courseId: item.courseId,
                        studentId: order.studentId,
                    },
                });
            }

            return order;
        });
    }
}
