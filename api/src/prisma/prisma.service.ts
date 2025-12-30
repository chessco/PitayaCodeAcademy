import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContext } from '../common/tenant/tenant.context';

@Injectable()
export class PrismaService implements OnModuleInit {
    private _client: any;

    constructor() {
        const baseClient = new PrismaClient();
        this._client = baseClient.$extends({
            query: {
                $allModels: {
                    async $allOperations({ model, operation, args, query }: any) {
                        const tenantIsolatedModels = [
                            'Course', 'Lesson', 'Enrollment', 'Coupon', 'Order', 'TenantMembership'
                        ];

                        if (tenantIsolatedModels.includes(model)) {
                            const tenantId = new TenantContext().tenantId;

                            if (tenantId) {
                                args.where = { ...args.where, tenantId };

                                if (operation === 'create' || operation === 'createMany') {
                                    if (Array.isArray(args.data)) {
                                        args.data = args.data.map((item: any) => ({ ...item, tenantId }));
                                    } else {
                                        args.data = { ...args.data, tenantId };
                                    }
                                }
                            }
                        }

                        return query(args);
                    },
                },
            },
        });
    }

    get client() {
        return this._client;
    }

    async onModuleInit() {
        await this._client.$connect();
    }

    // Delegate common methods for easier IDE support and usage
    get user() { return this._client.user; }
    get tenant() { return this._client.tenant; }
    get tenantMembership() { return this._client.tenantMembership; }
    get course() { return this._client.course; }
    get lesson() { return this._client.lesson; }
    get enrollment() { return this._client.enrollment; }
    get order() { return this._client.order; }
    get coupon() { return this._client.coupon; }
}
