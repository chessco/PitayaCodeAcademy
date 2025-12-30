import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // I need to create this wrapper
import { TenantGuard } from '../common/guards/tenant.guard';
import { RbacGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantRole } from '@prisma/client';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CourseController {
    constructor(private courseService: CourseService) { }

    @Get()
    async findAll() {
        return this.courseService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.courseService.findOne(id);
    }

    @Post()
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async create(@Request() req: any, @Body() body: CreateCourseDto) {
        return this.courseService.create(req.tenantMembership.id, body);
    }

    @Put(':id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
        // Note: In production, check if this instructor owns the course
        return this.courseService.update(id, body);
    }
}
