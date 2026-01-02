import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class EnrollmentController {
    constructor(private enrollmentService: EnrollmentService) { }

    @Get('my')
    async getMyEnrollments(@Request() req: any) {
        // req.tenantMembership is attached by TenantGuard
        return this.enrollmentService.getMyEnrollments(req.tenantMembership.id);
    }

    @Get('course/:courseId')
    async getByCourse(@Param('courseId') courseId: string) {
        return this.enrollmentService.getStudentsByCourse(courseId);
    }
}
