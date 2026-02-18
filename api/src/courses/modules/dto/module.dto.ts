import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    sortOrder: number;
}

export class UpdateModuleDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsInt()
    @IsOptional()
    sortOrder?: number;
}
