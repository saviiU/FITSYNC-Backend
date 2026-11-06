import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionNotesService } from './session-notes.service';
import { CreateSessionNoteDto } from './dto/create-session-note.dto';
import { UpdateSessionNoteDto } from './dto/update-session-note.dto';

@ApiTags('session-notes')
@Controller('session-notes')
export class SessionNotesController {
  constructor(private readonly service: SessionNotesService) {}

  @Post()
  create(@Query('trainerId') trainerId: string, @Body() dto: CreateSessionNoteDto) {
    return this.service.create(trainerId, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Query('trainerId') trainerId: string,
    @Body() dto: UpdateSessionNoteDto,
  ) {
    return this.service.update(id, trainerId, dto);
  }

  @Get('client/:clientId')
  progress(@Param('clientId') clientId: string) {
    return this.service.findByClient(clientId);
  }
}