import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debug() {
    const courses = await prisma.course.findMany({
        include: {
            instructor: { include: { user: true } },
            tenant: true
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log('--- ALL COURSES IN DB ---');
    courses.forEach(c => {
        console.log(`ID: ${c.id}`);
        console.log(`Title: ${c.title}`);
        console.log(`Slug: ${c.slug}`);
        console.log(`Tenant: ${c.tenant.slug} (${c.tenant.id})`);
        console.log(`Instructor: ${c.instructor.user.name} (${c.instructor.id})`);
        console.log(`Created: ${c.createdAt}`);
        console.log('------------------------');
    });
}

debug();
