import { Controller, Get, Post, Put, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // I need to create this wrapper
import { TenantGuard } from '../common/guards/tenant.guard';
import { RbacGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantRole } from '@prisma/client';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Public } from '../common/decorators/public.decorator';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('courses')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CourseController {
    constructor(
        private courseService: CourseService,
        private tenantContext: TenantContext,
    ) { }

    @Public()
    @Get()
    async findAll(@Request() req: any) {
        const tenantId = this.tenantContext.tenantIdOrThrow;
        const isStudio = req.query.studio === 'true';
        const membership = req.tenantMembership;

        const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
        const take = req.query.take ? parseInt(req.query.take as string) : undefined;

        if (isStudio && membership) {
            if (membership.role === TenantRole.INSTRUCTOR) {
                return this.courseService.findAll(tenantId, {
                    instructorId: membership.id,
                    skip,
                    take
                });
            }
            // Admin sees all in studio
            return this.courseService.findAll(tenantId, { skip, take });
        }

        // Public catalog: only published
        return this.courseService.findAll(tenantId, { isPublished: true, skip, take });
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.courseService.findOne(id);
    }

    @Post()
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async create(@Request() req: any, @Body() body: CreateCourseDto) {
        const tenantId = this.tenantContext.tenantIdOrThrow;
        return this.courseService.create(tenantId, req.tenantMembership.id, body);
    }

    @Patch(':id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async update(@Param('id') id: string, @Request() req: any, @Body() body: UpdateCourseDto) {
        console.log(`[CourseController] Update request for ID: ${id}`, body);
        const membership = req.tenantMembership;
        const course = await this.courseService.findOne(id);

        if (membership.role === TenantRole.INSTRUCTOR && course.instructorId !== membership.id) {
            console.warn(`[CourseController] Forbidden: Instructor ${membership.id} tried to edit course ${id} owned by ${course.instructorId}`);
            throw new ForbiddenException('No tienes permiso para editar este curso');
        }

        try {
            const result = await this.courseService.update(id, body);
            console.log(`[CourseController] Course ${id} updated successfully`);
            return result;
        } catch (e) {
            console.error(`[CourseController] Error updating course ${id}:`, e);
            throw e;
        }
    }
}
