import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { DiscussionsService } from './discussions.service';
import { CreateTopicDto, CreatePostDto, UpdateTopicDto } from './dto/discussions.dto';
import { TenantContext } from '../common/tenant/tenant.context';

@Controller('discussions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DiscussionsController {
    constructor(
        private discussionsService: DiscussionsService,
        private tenantContext: TenantContext,
    ) { }

    @Get('course/:courseId')
    async getTopics(@Param('courseId') courseId: string) {
        return this.discussionsService.getTopicsByCourse(courseId);
    }

    @Get('topic/:topicId')
    async getTopicDetail(@Param('topicId') topicId: string) {
        return this.discussionsService.getTopicDetail(topicId);
    }

    @Post('topic')
    async createTopic(@Request() req: any, @Body() dto: CreateTopicDto) {
        const userId = req.user.id;
        const tenantId = this.tenantContext.tenantIdOrThrow;
        return this.discussionsService.createTopic(userId, tenantId, dto);
    }

    @Post('post')
    async createPost(@Request() req: any, @Body() dto: CreatePostDto) {
        const userId = req.user.id;
        const tenantId = this.tenantContext.tenantIdOrThrow;
        return this.discussionsService.createPost(userId, tenantId, dto);
    }

    @Patch('topic/:topicId')
    async updateTopic(@Param('topicId') topicId: string, @Request() req: any, @Body() dto: UpdateTopicDto) {
        const userId = req.user.id;
        return this.discussionsService.updateTopic(userId, topicId, dto);
    }
}
