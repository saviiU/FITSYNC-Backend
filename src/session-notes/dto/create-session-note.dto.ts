import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean, IsInt, IsObject, IsOptional, IsString, IsUUID, Min, MinLength,
} from 'class-validator';

export class CreateSessionNoteDto {
  @ApiProperty() @IsInt() bookingId: number;
  @ApiProperty() @IsUUID() clientId: string;
  @ApiProperty() @IsString() @MinLength(1) notes: string;
  @ApiPropertyOptional({ example: 'Upper Body Push' }) @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional({ example: 50 }) @IsOptional() @IsInt() @Min(1) durationMin?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPersonalRecord?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() recommendations?: string;
  @ApiPropertyOptional({ example: { reps: 30, weightKg: 20 } })
  @IsOptional() @IsObject() metrics?: Record<string, number>;
}