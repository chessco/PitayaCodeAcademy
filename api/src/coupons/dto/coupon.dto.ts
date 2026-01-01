import { IsString, IsEnum, IsDecimal, IsInt, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { DiscountType } from '@prisma/client';

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsDecimal()
    discountValue: number;

    @IsInt()
    @IsOptional()
    maxUses?: number;

    @IsDateString()
    @IsOptional()
    startsAt?: string;

    @IsDateString()
    @IsOptional()
    expiresAt?: string;
}

export class UpdateCouponDto {
    @IsString()
    @IsOptional()
    code?: string;

    @IsEnum(DiscountType)
    @IsOptional()
    discountType?: DiscountType;

    @IsDecimal()
    @IsOptional()
    discountValue?: number;

    @IsInt()
    @IsOptional()
    maxUses?: number;

    @IsDateString()
    @IsOptional()
    startsAt?: string;

    @IsDateString()
    @IsOptional()
    expiresAt?: string;
}
