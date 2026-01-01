import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.coupon.findMany({
            where: { tenantId },
            include: { courses: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const coupon = await this.prisma.coupon.findFirst({
            where: { id, tenantId },
            include: { courses: true },
        });
        if (!coupon) throw new NotFoundException('Coupon not found');
        return coupon;
    }

    async create(tenantId: string, dto: CreateCouponDto) {
        const existing = await this.prisma.coupon.findUnique({
            where: { tenantId_code: { tenantId, code: dto.code } },
        });
        if (existing) throw new ConflictException('Coupon code already exists');

        return this.prisma.coupon.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async update(tenantId: string, id: string, dto: UpdateCouponDto) {
        await this.findOne(tenantId, id);
        return this.prisma.coupon.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        return this.prisma.coupon.delete({ where: { id } });
    }
}
