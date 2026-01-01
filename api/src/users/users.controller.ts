import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly tenantContext: TenantContext,
    ) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.usersService.findAll(this.tenantContext.tenantIdOrThrow);
    }

    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.usersService.getProfile(req.user.id, this.tenantContext.tenantIdOrThrow);
    }

    @Patch('profile')
    async updateProfile(@Request() req: any, @Body() data: any) {
        return this.usersService.updateProfile(req.user.id, this.tenantContext.tenantIdOrThrow, data);
    }
}
