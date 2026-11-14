import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchTrainersDto {
  @ApiPropertyOptional() @IsOptional() @IsString() specialization?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(5) minRating?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maxFee?: number;
  @ApiPropertyOptional({ enum: ['rating', 'fee', 'experience'] })
  @IsOptional() @IsIn(['rating', 'fee', 'experience']) sortBy?: 'rating' | 'fee' | 'experience';
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 10 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number = 10;
  @ApiPropertyOptional({ description: 'Matches trainer name or specialization' })
  @IsOptional() @IsString() q?: string;
}