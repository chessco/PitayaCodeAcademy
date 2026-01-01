import { Controller, Get, Patch, Param, Query, UseGuards, Request, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { NotificationsService } from './notifications.service';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('notifications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class NotificationsController {
    constructor(
        private notificationsService: NotificationsService,
        private tenantContext: TenantContext,
    ) { }

    @Get()
    async getNotifications(@Request() req: any, @Query('filter') filter?: string) {
        const userId = req.user.id;
        const tenantId = this.tenantContext.tenantIdOrThrow;
        return this.notificationsService.getNotifications(userId, tenantId, filter);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Request() req: any) {
        const userId = req.user.id;
        return this.notificationsService.markAsRead(id, userId);
    }

    @Post('read-all')
    async markAllAsRead(@Request() req: any) {
        const userId = req.user.id;
        const tenantId = this.tenantContext.tenantIdOrThrow;
        return this.notificationsService.markAllAsRead(userId, tenantId);
    }
}
