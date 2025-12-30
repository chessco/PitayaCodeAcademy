import 'dotenv/config';
import { PrismaClient, TenantRole, GlobalRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

console.log('DATABASE_URL is:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    // 1. Create Tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo' },
        update: {},
        create: {
            name: 'PitayaCode | Academy',
            slug: 'demo',
        },
    });

    // 2. Create User
    const user = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            email: 'admin@demo.com',
            passwordHash,
            globalRole: GlobalRole.USER,
        },
    });

    // 3. Create Membership
    await prisma.tenantMembership.upsert({
        where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
        update: {},
        create: {
            userId: user.id,
            tenantId: tenant.id,
            role: TenantRole.ADMIN,
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
