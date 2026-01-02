import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto, CreatePostDto, UpdateTopicDto } from './dto/discussions.dto';

@Injectable()
export class DiscussionsService {
    constructor(private prisma: PrismaService) { }

    async getTopicsByCourse(courseId: string) {
        return this.prisma.discussionTopic.findMany({
            where: { courseId },
            include: {
                author: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                },
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' }
            ]
        });
    }

    async getStudioTopics(tenantId: string, instructorId?: string) {
        const where: any = { course: { tenantId } };

        // If instructorId is provided, filter topics for courses taught by this instructor
        if (instructorId) {
            where.course.instructorId = instructorId;
        }

        return this.prisma.discussionTopic.findMany({
            where,
            include: {
                author: {
                    include: {
                        user: {
                            select: { name: true, email: true, id: true }
                        }
                    }
                },
                course: {
                    select: { title: true, id: true }
                },
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: [
                { isPinned: 'desc' },
                { createdAt: 'desc' }
            ]
        });
    }

    async getTopicDetail(topicId: string) {
        const topic = await this.prisma.discussionTopic.findUnique({
            where: { id: topicId },
            include: {
                author: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                },
                course: {
                    select: { title: true }
                },
                posts: {
                    include: {
                        author: {
                            include: {
                                user: {
                                    select: { name: true, email: true }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!topic) throw new NotFoundException('Topic not found');

        // Increment views
        await this.prisma.discussionTopic.update({
            where: { id: topicId },
            data: { views: { increment: 1 } }
        });

        return topic;
    }

    async createTopic(userId: string, tenantId: string, dto: CreateTopicDto) {
        const membership = await this.prisma.tenantMembership.findUnique({
            where: { userId_tenantId: { userId, tenantId } }
        });

        if (!membership) throw new ForbiddenException('User not part of this tenant');

        return this.prisma.discussionTopic.create({
            data: {
                ...dto,
                authorId: membership.id
            }
        });
    }

    async createPost(userId: string, tenantId: string, dto: CreatePostDto) {
        const membership = await this.prisma.tenantMembership.findUnique({
            where: { userId_tenantId: { userId, tenantId } }
        });

        if (!membership) throw new ForbiddenException('User not part of this tenant');

        return this.prisma.discussionPost.create({
            data: {
                ...dto,
                authorId: membership.id
            }
        });
    }

    async updateTopic(userId: string, topicId: string, dto: UpdateTopicDto) {
        const topic = await this.prisma.discussionTopic.findUnique({
            where: { id: topicId },
            include: { author: true }
        });

        if (!topic) throw new NotFoundException('Topic not found');

        // Only author or admin can update (for simplicity, just checking author here, admin check can be in controller)
        // Wait, let's get the user membership
        const membership = await this.prisma.tenantMembership.findFirst({
            where: { userId, tenantId: topic.author.tenantId }
        });

        if (topic.authorId !== membership?.id && membership?.role !== 'ADMIN') {
            throw new ForbiddenException('Not allowed to update this topic');
        }

        return this.prisma.discussionTopic.update({
            where: { id: topicId },
            data: dto
        });
    }

    async deleteTopic(userId: string, topicId: string) {
        const topic = await this.prisma.discussionTopic.findUnique({
            where: { id: topicId },
            include: { author: true }
        });

        if (!topic) throw new NotFoundException('Topic not found');

        const membership = await this.prisma.tenantMembership.findFirst({
            where: { userId, tenantId: topic.author.tenantId }
        });

        // Instructors can delete topics in their courses, Admins can delete anything
        if (membership?.role !== 'ADMIN') {
            const course = await this.prisma.course.findUnique({ where: { id: topic.courseId } });
            if (course?.instructorId !== membership?.id) {
                throw new ForbiddenException('Not allowed to delete this topic');
            }
        }

        return this.prisma.discussionTopic.delete({
            where: { id: topicId }
        });
    }
}
