import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { DiscussionCategory } from '@prisma/client';

export class CreateTopicDto {
    @IsString()
    courseId: string;

    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsEnum(DiscussionCategory)
    @IsOptional()
    category?: DiscussionCategory;
}

export class CreatePostDto {
    @IsString()
    topicId: string;

    @IsString()
    content: string;
}

export class UpdateTopicDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    isPinned?: boolean;

    @IsBoolean()
    @IsOptional()
    isResolved?: boolean;
}
