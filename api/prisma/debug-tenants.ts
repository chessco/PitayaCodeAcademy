import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG TENANTS START ---');
    const tenants = await prisma.tenant.findMany();
    console.log('Found tenants:');
    tenants.forEach(t => {
        console.log(`- ID: ${t.id}, Name: ${t.name}, Slug: ${t.slug}`);
    });
    console.log('--- DEBUG TENANTS END ---');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
