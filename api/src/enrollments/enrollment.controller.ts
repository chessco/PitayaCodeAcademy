import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
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

    @Post('course')
    async enrollStudentByEmail(@Body() body: { email: string; courseId: string }, @Request() req: any) {
        return this.enrollmentService.enrollByEmail(body.email, body.courseId, req.tenantMembership.tenantId);
    }

    @Get(':courseId/progress')
    async getProgress(@Param('courseId') courseId: string, @Request() req: any) {
        return this.enrollmentService.getProgress(req.tenantMembership.id, courseId);
    }

    @Post(':courseId/lessons/:lessonId/complete')
    async completeLesson(@Param('courseId') courseId: string, @Param('lessonId') lessonId: string, @Request() req: any) {
        return this.enrollmentService.markLessonComplete(req.tenantMembership.id, courseId, lessonId);
    }
}
