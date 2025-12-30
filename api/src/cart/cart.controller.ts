import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CartController {
    constructor(private cartService: CartService) { }

    @Post('checkout')
    async checkout(@Request() req: any, @Body() body: { courseIds: string[] }) {
        return this.cartService.createOrder(req.tenantMembership.id, body.courseIds);
    }

    // Demo helper to fulfill order without actual Stripe webhook for now
    @Post('fulfill/:orderId')
    async fulfill(@Param('orderId') orderId: string) {
        return this.cartService.fulfillOrder(orderId);
    }
}
