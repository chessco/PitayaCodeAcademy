import { IsString, IsDecimal, IsBoolean, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    level?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;
}

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    level?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;
}
