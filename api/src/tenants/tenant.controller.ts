import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
    constructor(private readonly tenantService: TenantService) { }

    @Get('me')
    async getMe() {
        return this.tenantService.getCurrentTenant();
    }

    @Patch('me')
    async updateMe(@Body() body: { name?: string; accentColor?: string; logoUrl?: string }) {
        return this.tenantService.updateCurrentTenant(body);
    }
}
