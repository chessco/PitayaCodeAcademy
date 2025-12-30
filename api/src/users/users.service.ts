import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.client.user.findUnique({
            where: { email },
            include: { memberships: true },
        });
    }

    async create(email: string, passwordPlain: string) {
        const passwordHash = await bcrypt.hash(passwordPlain, 10);
        return this.prisma.client.user.create({
            data: {
                email,
                passwordHash,
            },
        });
    }
}
