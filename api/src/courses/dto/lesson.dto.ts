import { IsString, IsInt, IsBoolean, IsOptional, IsNotEmpty, IsUrl, ValidateIf } from 'class-validator';


export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsUrl()
    @IsOptional()
    videoUrl?: string;

    @IsInt()
    sortOrder: number;
}

export class UpdateLessonDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsUrl()
    @IsOptional()
    videoUrl?: string;

    @IsInt()
    @IsOptional()
    sortOrder?: number;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @ValidateIf((o) => o.moduleId !== null)
    @IsString()
    @IsOptional()
    moduleId?: string | null;
}

export class ReorderLessonsDto {
    @IsString({ each: true })
    lessonIds: string[];
}

export class CreateLessonResourceDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsOptional()
    fileSize?: string;

    @IsString()
    @IsOptional()
    fileType?: string;
}
