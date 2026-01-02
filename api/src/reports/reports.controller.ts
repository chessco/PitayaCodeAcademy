import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ReportsService } from './reports.service';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('reports')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportsController {
    constructor(
        private reportsService: ReportsService,
        private tenantContext: TenantContext
    ) { }

    @Get('studio/summary')
    async getSummary(@Request() req: any) {
        return this.reportsService.getSummary(this.tenantContext.tenantIdOrThrow, req.user.id);
    }

    @Get('studio/income')
    async getIncomePerformance(@Request() req: any) {
        return this.reportsService.getIncomePerformance(req.user.id);
    }

    @Get('studio/courses/top')
    async getTopCourses(@Request() req: any) {
        return this.reportsService.getTopSellingCourses(req.user.id);
    }

    @Get('studio/transactions')
    async getTransactions(@Request() req: any) {
        return this.reportsService.getDetailedTransactions(req.user.id);
    }
}
