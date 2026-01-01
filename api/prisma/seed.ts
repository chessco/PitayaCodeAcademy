import 'dotenv/config';
import { PrismaClient, TenantRole, GlobalRole, DiscountType, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

console.log('DATABASE_URL is:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('pitaya123', 10);

    // 1. Create Tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo' },
        update: {},
        create: {
            name: 'PitayaCode | Academy',
            slug: 'demo',
        },
    });

    // 2. Create Users & Memberships
    const usersData = [
        { email: 'admin@pitayacode.io', name: 'Admin Principal', role: TenantRole.ADMIN },
        { email: 'profesor@pitayacode.io', name: 'Maestro Prueba', role: TenantRole.INSTRUCTOR },
        { email: 'alumno@pitayacode.io', name: 'Alumno Prueba', role: TenantRole.STUDENT },
    ];

    let instructorId = '';

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { passwordHash }, // Ensure password is updated if user exists
            create: {
                email: u.email,
                name: u.name,
                passwordHash,
                globalRole: GlobalRole.USER,
            },
        });

        const membership = await prisma.tenantMembership.upsert({
            where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
            update: {
                role: u.role,
                ...(u.email === 'alumno@pitayacode.io' ? {
                    bio: 'Apasionado por el código y el café. Aprendiendo React y Node.js para construir el futuro.',
                    jobTitle: 'Estudiante Full Stack',
                    socialGithub: 'https://github.com',
                    socialLinkedin: 'https://linkedin.com',
                    socialTwitter: 'https://twitter.com',
                    interests: JSON.stringify(['JavaScript', 'React Native', 'UI/UX Design', 'Node.js']),
                    xp: 2450,
                    level: 5,
                    isEmailConfirmed: true,
                    isIdentityVerified: false
                } : {})
            },
            create: {
                userId: user.id,
                tenantId: tenant.id,
                role: u.role,
                ...(u.email === 'alumno@pitayacode.io' ? {
                    bio: 'Apasionado por el código y el café. Aprendiendo React y Node.js para construir el futuro.',
                    jobTitle: 'Estudiante Full Stack',
                    socialGithub: 'https://github.com',
                    socialLinkedin: 'https://linkedin.com',
                    socialTwitter: 'https://twitter.com',
                    interests: JSON.stringify(['JavaScript', 'React Native', 'UI/UX Design', 'Node.js']),
                    xp: 2450,
                    level: 5,
                    isEmailConfirmed: true,
                    isIdentityVerified: false
                } : {})
            },
        });

        if (u.role === TenantRole.INSTRUCTOR || u.role === TenantRole.ADMIN) {
            instructorId = membership.id; // Keep one for assigning courses
        }
    }

    // 4. Create Courses
    // Ensure we get the correct instructor (profesor@pitayacode.io)
    const instructorUser = await prisma.user.findUnique({ where: { email: 'profesor@pitayacode.io' } });
    const instructorMembership = await prisma.tenantMembership.findUnique({
        where: { userId_tenantId: { userId: instructorUser!.id, tenantId: tenant.id } }
    });
    const correctInstructorId = instructorMembership!.id;

    const course1 = await prisma.course.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: 'ux-fundamentals' } },
        update: { instructorId: correctInstructorId },
        create: {
            tenantId: tenant.id,
            instructorId: correctInstructorId,
            title: 'Fundamentos de UX/UI',
            slug: 'ux-fundamentals',
            description: 'Aprende los principios básicos del diseño de experiencia de usuario.',
            price: 49.99,
            category: 'Diseño',
            level: 'Principiante',
            thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=1000&auto=format&fit=crop',
            isPublished: true,
        },
    });

    const course2 = await prisma.course.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: 'full-stack-marketing' } },
        update: { instructorId: correctInstructorId },
        create: {
            tenantId: tenant.id,
            instructorId: correctInstructorId,
            title: 'Marketing Digital 360',
            slug: 'full-stack-marketing',
            description: 'Domina el SEO, SEM, y Redes Sociales con proyectos prácticos.',
            price: 59.99,
            category: 'Marketing',
            level: 'Intermedio',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
            isPublished: true,
        },
    });

    const course3 = await prisma.course.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: 'react-advanced-patterns' } },
        update: { instructorId: correctInstructorId },
        create: {
            tenantId: tenant.id,
            instructorId: correctInstructorId,
            title: 'Curso de React Avanzado: Hooks y Patrones',
            slug: 'react-advanced-patterns',
            description: 'Aprende los conceptos avanzados de React.js incluyendo Hooks personalizados y patrones de diseño.',
            price: 79.99,
            category: 'Desarrollo Web',
            level: 'Avanzado',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
            isPublished: true,
        },
    });

    // 5. Create Modules & Lessons for React Course
    const resMod = await prisma.module.create({
        data: {
            tenantId: tenant.id,
            courseId: course3.id,
            title: 'Módulo 1: Hooks Pro',
            sortOrder: 1,
        },
    });

    const lessonsData = [
        { title: 'Introducción a Hooks', sortOrder: 1, moduleId: resMod.id, courseId: course3.id },
        { title: 'useState y useEffect a fondo', sortOrder: 2, moduleId: resMod.id, courseId: course3.id },
        { title: 'Creando Custom Hooks', sortOrder: 3, moduleId: resMod.id, courseId: course3.id },
    ];

    for (const l of lessonsData) {
        await prisma.lesson.create({ data: l });
    }

    // 6. Create Coupons
    const coupons = [
        {
            code: 'VERANO2024',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 20,
            maxUses: 100,
            startsAt: new Date('2024-06-01'),
            expiresAt: new Date('2024-08-31'),
        },
        {
            code: 'REACT100',
            discountType: DiscountType.FIXED,
            discountValue: 10,
            maxUses: 50,
            startsAt: new Date('2024-01-01'),
        },
        {
            code: 'PROMO_LANZAMIENTO',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 50,
            maxUses: 200,
            startsAt: new Date('2024-10-15'),
            expiresAt: new Date('2024-12-31'),
        }
    ];

    for (const c of coupons) {
        await prisma.coupon.upsert({
            where: { tenantId_code: { tenantId: tenant.id, code: c.code } },
            update: {},
            create: {
                ...c,
                tenantId: tenant.id,
            },
        });
    }

    // 7. Enrol Student in Courses
    const studentUser = await prisma.user.findUnique({ where: { email: 'alumno@pitayacode.io' } });
    if (studentUser) {
        const studentMembership = await prisma.tenantMembership.findUnique({
            where: { userId_tenantId: { userId: studentUser.id, tenantId: tenant.id } }
        });

        if (studentMembership) {
            console.log('Enrolling student in all courses...');
            const allCourses = [course1, course2, course3];
            for (const course of allCourses) {
                await prisma.enrollment.upsert({
                    where: { courseId_studentId: { courseId: course.id, studentId: studentMembership.id } },
                    update: {},
                    create: {
                        courseId: course.id,
                        studentId: studentMembership.id,
                    }
                });
            }
        }
    }

    // 8. Create Discussion Topics
    console.log('Creating sample discussions...');
    const instructorMembershipForDiscussions = await prisma.tenantMembership.findUnique({
        where: { userId_tenantId: { userId: instructorUser!.id, tenantId: tenant.id } }
    });
    const studentMembershipForDiscussions = await prisma.tenantMembership.findFirst({
        where: { userId: studentUser!.id, tenantId: tenant.id }
    });

    const topic1 = await prisma.discussionTopic.create({
        data: {
            courseId: course3.id,
            authorId: instructorMembershipForDiscussions!.id,
            title: 'Bienvenidos al curso: Reglas y Pautas del Foro',
            content: 'Hola a todos, bienvenidos al curso de React Avanzado. Por favor lean estas pautas antes de publicar para mantener el orden...',
            category: 'ANNOUNCEMENT',
            isPinned: true,
            views: 342,
        }
    });

    await prisma.discussionPost.create({
        data: {
            topicId: topic1.id,
            authorId: studentMembershipForDiscussions!.id,
            content: '¡Gracias instructor! Muy emocionado por comenzar.'
        }
    });

    const topic2 = await prisma.discussionTopic.create({
        data: {
            courseId: course3.id,
            authorId: studentMembershipForDiscussions!.id,
            title: 'Duda con Redux Toolkit en la lección 2',
            content: 'Estoy intentando configurar el store pero me sale un error de "reducer not valid". He revisado la documentación pero sigo sin entender qué falla...',
            category: 'QUESTION',
            isResolved: true,
            views: 56,
        }
    });

    await prisma.discussionPost.create({
        data: {
            topicId: topic2.id,
            authorId: instructorMembershipForDiscussions!.id,
            content: 'Hola Alumno, asegúrate de que estás exportando el reducer correctamente desde tu slice.'
        }
    });

    // 9. Create Notifications
    console.log('Creating sample notifications...');
    const notificationsData = [
        {
            tenantId: tenant.id,
            studentId: studentMembershipForDiscussions!.id,
            type: NotificationType.FORUM,
            title: 'Instructor Carlos respondió a tu pregunta',
            content: 'En el hilo: "Error al implementar Redux Toolkit en producción". Carlos dice: "Hola Alex, revisa la configuración de tu store..."',
            link: `/courses/${course3.id}/forum/${topic2.id}`,
            isRead: false
        },
        {
            tenantId: tenant.id,
            studentId: studentMembershipForDiscussions!.id,
            type: NotificationType.COURSE,
            title: 'Contenido añadido a: React JS Avanzado',
            content: 'Se ha publicado una nueva lección en el Módulo 4: "Optimización de rendimiento con React.memo y useCallback".',
            link: `/courses/${course3.id}/player`,
            isRead: false
        },
        {
            tenantId: tenant.id,
            studentId: studentMembershipForDiscussions!.id,
            type: NotificationType.SYSTEM,
            title: 'Mantenimiento programado de la plataforma',
            content: 'La plataforma estará en mantenimiento este sábado de 2:00 AM a 4:00 AM (UTC). Por favor guarda tu progreso.',
            isRead: true
        },
        {
            tenantId: tenant.id,
            studentId: studentMembershipForDiscussions!.id,
            type: NotificationType.ACHIEVEMENT,
            title: '¡Felicidades! Tu certificado está listo',
            content: 'Has completado satisfactoriamente el curso "Fundamentos de CSS y Diseño Web". Ya puedes descargar tu certificado.',
            link: '/certificates',
            isRead: true
        },
        {
            tenantId: tenant.id,
            studentId: studentMembershipForDiscussions!.id,
            type: NotificationType.PROMOTION,
            title: 'Descuento exclusivo para estudiantes Pro',
            content: 'Aprovecha un 30% de descuento en el nuevo Workshop de "Arquitectura de Software Escalable". Oferta válida por 48 horas.',
            link: '/cart',
            isRead: true
        }
    ];

    for (const n of notificationsData) {
        await prisma.notification.create({ data: n });
    }

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
