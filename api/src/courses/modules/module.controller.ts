import { Controller, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RbacGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TenantRole } from '@prisma/client';
import { ModuleService } from './module.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Controller('courses/:courseId/modules')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ModuleController {
    constructor(private moduleService: ModuleService) { }

    @Post()
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async create(@Param('courseId') courseId: string, @Body() body: CreateModuleDto, @Request() req: any) {
        const tenantId = req.tenantMembership.tenantId;
        return this.moduleService.create(courseId, tenantId, body);
    }

    @Put(':id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async update(@Param('id') id: string, @Body() body: UpdateModuleDto) {
        return this.moduleService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(RbacGuard)
    @Roles(TenantRole.ADMIN, TenantRole.INSTRUCTOR)
    async delete(@Param('id') id: string) {
        return this.moduleService.delete(id);
    }
}
