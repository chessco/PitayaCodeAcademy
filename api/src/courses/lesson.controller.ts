import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RbacGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantRole } from '@prisma/client';
import { LessonService } from './lesson.service';
import { CreateLessonDto, UpdateLessonDto, ReorderLessonsDto, CreateLessonResourceDto } from './dto/lesson.dto';

@Controller('courses/:courseId/lessons')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LessonController {
    constructor(private lessonService: LessonService) { }

    @Get()
    async findAll(@Param('courseId') courseId: string) {
        return this.lessonService.findAllByCourse(courseId);
    }

    @Post()
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async create(@Param('courseId') courseId: string, @Body() body: CreateLessonDto) {
        return this.lessonService.create(courseId, body);
    }

    @Post('reorder')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async reorder(@Body() body: ReorderLessonsDto) {
        return this.lessonService.reorder(body.lessonIds);
    }

    @Put(':id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async update(@Param('id') id: string, @Body() body: UpdateLessonDto) {
        return this.lessonService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async delete(@Param('id') id: string) {
        return this.lessonService.delete(id);
    }

    @Post(':id/resources')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async addResource(@Param('id') id: string, @Body() body: CreateLessonResourceDto) {
        return this.lessonService.addResource(id, body);
    }

    @Delete(':lessonId/resources/:id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async removeResource(@Param('id') id: string) {
        return this.lessonService.removeResource(id);
    }
}
