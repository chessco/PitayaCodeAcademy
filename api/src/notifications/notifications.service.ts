import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(userId: string, tenantId: string, filter?: string) {
        const membership = await this.prisma.tenantMembership.findUnique({
            where: { userId_tenantId: { userId, tenantId } }
        });

        if (!membership) return [];

        let where: any = { studentId: membership.id };

        if (filter === 'unread') {
            where.isRead = false;
        } else if (filter === 'SYSTEM') {
            where.type = NotificationType.SYSTEM;
        } else if (filter === 'FORUM') {
            where.type = NotificationType.FORUM;
        }

        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(notificationId: string, userId: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId },
            include: { student: true }
        });

        if (!notification) throw new NotFoundException('Notification not found');
        if (notification.student.userId !== userId) throw new NotFoundException('Notification not found');

        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string, tenantId: string) {
        const membership = await this.prisma.tenantMembership.findUnique({
            where: { userId_tenantId: { userId, tenantId } }
        });

        if (!membership) return { count: 0 };

        return this.prisma.notification.updateMany({
            where: { studentId: membership.id, isRead: false },
            data: { isRead: true }
        });
    }
}
