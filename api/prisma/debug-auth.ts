import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG AUTH START ---');
    const email = 'admin@pitayacode.io';
    const password = 'pitaya123';

    console.log(`Checking user: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('ERROR: User not found in database!');
    } else {
        console.log('User found:', user.id, user.name);
        console.log('Stored Hash:', user.passwordHash);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        console.log(`Password '${password}' match result:`, isMatch);

        if (isMatch) {
            console.log('SUCCESS: Credentials are valid in the DB.');
        } else {
            console.error('ERROR: Password check failed.');
        }
    }
    console.log('--- DEBUG AUTH END ---');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
