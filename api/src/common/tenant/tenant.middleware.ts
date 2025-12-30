import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // 1. Resolve tenantId
        // In production, we'd use req.hostname. For development, we allow a header.
        let tenantId = req.headers['x-tenant-id'] as string;

        if (!tenantId) {
            // Example: tenant1.academia.com -> tenant1
            const host = req.hostname;
            const parts = host.split('.');
            if (parts.length >= 3) {
                tenantId = parts[0];
            }
        }

        // 2. Validate tenantId (In a real app, query DB here or use a cache)
        // For now, we assume if it exists, it's valid for testing
        if (!tenantId) {
            // If no tenant is resolved, we might allow the request (e.g. for landing page) 
            // or block it. For enterprise LMS, we usually require it.
            // For now, continue but context will be empty.
            return next();
        }

        // 3. Run the remainder of the request within the context
        TenantContext.run(tenantId, () => next());
    }
}
