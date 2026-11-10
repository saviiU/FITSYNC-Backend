import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionNote } from './session-note.entity';
import { SessionNotesService } from './session-notes.service';
import { SessionNotesController } from './session-notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessionNote])],
  controllers: [SessionNotesController],
  providers: [SessionNotesService],
})
export class SessionNotesModule {}