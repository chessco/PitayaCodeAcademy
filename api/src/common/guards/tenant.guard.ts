import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContext } from '../tenant/tenant.context';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private prisma: PrismaService, private tenantContext: TenantContext) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const tenantId = this.tenantContext.tenantId;

        if (!tenantId) {
            throw new ForbiddenException('Tenant context missing');
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
