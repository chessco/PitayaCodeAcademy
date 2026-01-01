import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post()
    async submitReview(@Request() req: any, @Body() body: any) {
        const studentId = req.tenantMembership.id;
        return this.reviewService.createOrUpdateReview(studentId, body);
    }

    @Get('my')
    async getAllMyReviews(@Request() req: any) {
        const studentId = req.tenantMembership.id;
        return this.reviewService.getReviewsByStudent(studentId);
    }

    @Get('summary/:courseId')
    async getSummary(@Param('courseId') courseId: string) {
        return this.reviewService.getCourseReviewSummary(courseId);
    }

    @Get('my/:courseId')
    async getMyReview(@Request() req: any, @Param('courseId') courseId: string) {
        const studentId = req.tenantMembership.id;
        return this.reviewService.getMyReview(studentId, courseId);
    }
}
