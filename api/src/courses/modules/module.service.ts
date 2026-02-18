import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Injectable()
export class ModuleService {
    constructor(private prisma: PrismaService) { }

    async create(courseId: string, tenantId: string, data: CreateModuleDto) {
        return this.prisma.module.create({
            data: {
                ...data,
                courseId,
                tenantId,
            },
            include: { lessons: true }
        });
    }

    async update(id: string, data: UpdateModuleDto) {
        return this.prisma.module.update({
            where: { id },
            data,
            include: { lessons: true }
        });
    }

    async delete(id: string) {
        // First disconnect lessons
        await this.prisma.lesson.updateMany({
            where: { moduleId: id },
            data: { moduleId: null }
        });

        return this.prisma.module.delete({
            where: { id },
        });
    }
}
