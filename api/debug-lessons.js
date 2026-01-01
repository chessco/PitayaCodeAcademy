const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courseId = 'f9fe58e6-3be6-4ec1-872b-e25887e1d63d';
    console.log(`Checking course: ${courseId}`);

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            _count: { select: { lessons: true, modules: true } },
            lessons: true,
            modules: { include: { lessons: true } }
        }
    });

    if (!course) {
        console.log("Course not found");
        return;
    }

    console.log(`Lessons count (total): ${course._count.lessons}`);
    console.log(`Modules count: ${course._count.modules}`);
    console.log(`General lessons count: ${course.lessons.filter(l => !l.moduleId).length}`);

    course.modules.forEach((m, idx) => {
        console.log(`Module ${idx + 1} (${m.title}): ${m.lessons.length} lessons`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
