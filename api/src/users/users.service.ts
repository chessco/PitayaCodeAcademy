import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.client.user.findUnique({
            where: { email },
            include: { memberships: true },
        });
    }

    async findById(id: string) {
        return this.prisma.client.user.findUnique({
            where: { id },
            include: { memberships: true },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.client.user.findMany({
            where: {
                memberships: {
                    some: { tenantId },
                },
            },
            include: {
                memberships: {
                    where: { tenantId },
                },
            },
        });
    }

    async create(email: string, passwordPlain: string, name?: string) {
        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        return this.prisma.client.user.create({
            data: {
                email,
                name,
                passwordHash,
            },
        });
    }

    async getProfile(userId: string, tenantId: string) {
        return this.prisma.client.tenantMembership.findUnique({
            where: { userId_tenantId: { userId, tenantId } },
            include: { user: true },
        });
    }

    async updateProfile(userId: string, tenantId: string, data: any) {
        const { name, email, ...membershipData } = data;

        // Update User name if provided
        if (name || email) {
            await this.prisma.client.user.update({
                where: { id: userId },
                data: {
                    ...(name ? { name } : {}),
                    ...(email ? { email } : {}),
                },
            });
        }

        // Update Membership data
        return this.prisma.client.tenantMembership.update({
            where: { userId_tenantId: { userId, tenantId } },
            data: membershipData,
        });
    }
}
