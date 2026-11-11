import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'

export class CreateSessionNoteDto {
    

  @ApiProperty() @IsInt() bookingId: number;

  @ApiProperty() @IsUUID() clientId: string;

  @ApiProperty() @IsString() @MinLength(1) notes: string;

  @ApiPropertyOptional() @IsOptional() @IsString() recommendations?: string;

  @ApiPropertyOptional({ example: { reps: 30, weightKg: 20, durationMin: 60 } })

  @IsOptional() @IsObject() metrics?: Record<string, number>;
}