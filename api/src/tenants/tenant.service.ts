import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContext } from '../common/tenant/tenant.context';

@Injectable()
export class TenantService {
    constructor(
        private prisma: PrismaService,
        private tenantContext: TenantContext,
    ) { }

    async getCurrentTenant() {
        const tenantId = this.tenantContext.tenantIdOrThrow;
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    async updateCurrentTenant(data: { name?: string; accentColor?: string; logoUrl?: string }) {
        const tenantId = this.tenantContext.tenantIdOrThrow;

        return this.prisma.tenant.update({
            where: { id: tenantId },
            data,
        });
    }
}
