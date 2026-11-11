import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSessionNoteDto } from './create-session-note.dto';

export class UpdateSessionNoteDto extends PartialType(
  OmitType(CreateSessionNoteDto, ['bookingId', 'clientId'] as const),
) {}