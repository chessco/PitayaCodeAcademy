import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantRole } from '@prisma/client';

@Controller('coupons')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Get()
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    findAll(@Request() req: any) {
        return this.couponService.findAll(req.user.tenantId);
    }

    @Get(':id')
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.couponService.findOne(req.user.tenantId, id);
    }

    @Post()
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    create(@Request() req: any, @Body() createCouponDto: CreateCouponDto) {
        return this.couponService.create(req.user.tenantId, createCouponDto);
    }

    @Patch(':id')
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    update(@Request() req: any, @Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        return this.couponService.update(req.user.tenantId, id, updateCouponDto);
    }

    @Delete(':id')
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    remove(@Request() req: any, @Param('id') id: string) {
        return this.couponService.remove(req.user.tenantId, id);
    }
}
