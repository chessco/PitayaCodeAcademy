import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { FinanceService } from './finance.service';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('finances')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FinanceController {
    constructor(
        private financeService: FinanceService,
        private tenantContext: TenantContext
    ) { }

    @Get('studio')
    async getStudioData(@Request() req: any) {
        const tenantId = this.tenantContext.tenantIdOrThrow;
        const instructorId = req.user.id;

        const metrics = await this.financeService.getInstructorMetrics(tenantId, instructorId);
        const trend = await this.financeService.getIncomeTrend(instructorId);
        const courses = await this.financeService.getCoursePerformance(instructorId);
        const transactions = await this.financeService.getTransactionHistory(instructorId);

        return {
            metrics,
            trend,
            courses,
            transactions
        };
    }
}
