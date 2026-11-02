import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTrainerProfileDto {
  @ApiProperty() @IsString() specialization: string;
  @ApiProperty() @IsInt() @Min(0) experienceYears: number;
  @ApiPropertyOptional() @IsOptional() @IsString() bio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certification?: string;
  @ApiProperty() @IsNumber() @Min(0) sessionFee: number;
  @ApiProperty() @IsString() location: string;
}