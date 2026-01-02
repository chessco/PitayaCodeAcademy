import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AnalyticsService } from './analytics.service';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('analytics')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AnalyticsController {
    constructor(
        private analyticsService: AnalyticsService,
        private tenantContext: TenantContext,
    ) { }

    @Get('studio')
    async getStudioAnalytics(@Request() req: any) {
        const tenantId = this.tenantContext.tenantIdOrThrow;
        const membership = req.tenantMembership;
        const instructorId = membership.id;

        const metrics = await this.analyticsService.getInstructorMetrics(tenantId, instructorId);
        const participation = await this.analyticsService.getParticipationData(instructorId);
        const dropoutLessons = await this.analyticsService.getTopDropoutLessons(instructorId);
        const couponPerformance = await this.analyticsService.getCouponPerformance(instructorId);

        return {
            metrics,
            participation,
            dropoutLessons,
            couponPerformance
        };
    }
}
