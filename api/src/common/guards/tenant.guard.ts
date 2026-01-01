import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContext } from '../tenant/tenant.context';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private tenantContext: TenantContext,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const tenantId = this.tenantContext.tenantId;

        console.log(`[TenantGuard] Path: ${request.url}, Public: ${isPublic}, TenantId: ${tenantId}`);
        const user = request.user;
        // TenantId already retrieved for logging

        if (!tenantId) {
            throw new ForbiddenException('Tenant context missing');
        }

        if (isPublic) {
            if (user) {
                // Try to resolve membership for public routes to allow drafts to show in Studio
                const membership = await this.prisma.tenantMembership.findUnique({
                    where: {
                        userId_tenantId: {
                            userId: user.userId,
                            tenantId: tenantId,
                        },
                    },
                });
                if (membership) {
                    request.tenantMembership = membership;
                }
            }
            return true;
        }

        if (!user) {
            return false; // Authentication handled by JwtGuard
        }

        // Check if user is a member of this tenant
        const membership = await this.prisma.client.tenantMembership.findUnique({
            where: {
                userId_tenantId: {
                    userId: user.userId,
                    tenantId: tenantId,
                },
            },
        });

        if (!membership) {
            throw new ForbiddenException('You are not a member of this academy');
        }

        // Attach membership to request for easier access in controllers/RbacGuard
        request.tenantMembership = membership;

        return true;
    }
}
