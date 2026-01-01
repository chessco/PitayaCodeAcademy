import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.course.count();
    console.log(`Total courses in DB: ${count}`);
    const courses = await prisma.course.findMany();
    console.log(JSON.stringify(courses, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
