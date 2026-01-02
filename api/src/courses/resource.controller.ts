import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ResourceService } from './resource.service';

@Controller('resources')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ResourceController {
    constructor(private resourceService: ResourceService) { }

    @Get('course/:courseId')
    async findAllByCourse(@Param('courseId') courseId: string) {
        return this.resourceService.findAllByCourse(courseId);
    }

    @Post('course/:courseId')
    async create(
        @Param('courseId') courseId: string,
        @Body() data: { title: string, url: string, fileSize?: string, fileType?: string, lessonId?: string }
    ) {
        return this.resourceService.create(courseId, data);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() data: { title?: string, isVisible?: boolean, lessonId?: string | null }
    ) {
        return this.resourceService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.resourceService.delete(id);
    }
}
