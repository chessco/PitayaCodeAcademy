import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private prisma: PrismaService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // 1. Resolve tenant identifier (slug or UUID)
        let tenantIdentifier = req.headers['x-tenant-id'] as string;

        if (!tenantIdentifier) {
            const host = req.hostname;
            const parts = host.split('.');
            if (parts.length >= 3) {
                tenantIdentifier = parts[0];
            }
        }

        if (!tenantIdentifier) {
            console.warn('[TenantMiddleware] No tenant identifier found');
            return next();
        }

        console.log(`[TenantMiddleware] Resolving tenant for: ${tenantIdentifier}`);

        // 2. Resolve Tenant
        let tenant;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantIdentifier);

        if (isUuid) {
            tenant = await this.prisma.tenant.findUnique({ where: { id: tenantIdentifier } });
        } else {
            tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantIdentifier } });
        }

        if (!tenant) {
            console.warn(`[TenantMiddleware] Tenant not found for identifier: ${tenantIdentifier}`);
            return next();
        }

        // 3. Run the remainder of the request within the context
        TenantContext.run(tenant.id, () => next());
    }
}
