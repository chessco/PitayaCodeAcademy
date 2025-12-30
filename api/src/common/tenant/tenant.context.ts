import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable({ scope: Scope.DEFAULT }) // Singleton that manages the storage
export class TenantContext {
    private static readonly storage = new AsyncLocalStorage<{ tenantId: string }>();

    static run<T>(tenantId: string, callback: () => T): T {
        return this.storage.run({ tenantId }, callback);
    }

    get tenantId(): string | undefined {
        return TenantContext.storage.getStore()?.tenantId;
    }

    // Helper for Prisma enforcement
    get tenantIdOrThrow(): string {
        const id = this.tenantId;
        if (!id) {
            throw new Error('Tenant context not initialized. Ensure TenantMiddleware is active.');
        }
        return id;
    }
}
