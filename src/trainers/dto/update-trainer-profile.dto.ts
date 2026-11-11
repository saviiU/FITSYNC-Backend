import { PartialType } from '@nestjs/swagger';
import { CreateTrainerProfileDto } from './create-trainer-profile.dto';

export class UpdateTrainerProfileDto extends PartialType(CreateTrainerProfileDto) {}