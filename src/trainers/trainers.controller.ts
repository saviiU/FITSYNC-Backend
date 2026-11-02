import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TrainersService } from './trainers.service';
import { CreateTrainerProfileDto } from './dto/create-trainer-profile.dto';
import { SearchTrainersDto } from './dto/search-trainers.dto';

@ApiTags('trainers')
@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  // TEMP: userId comes from the query until Saajidh's JWT auth is merged,
  // then replace with the logged-in user's id.
  @Post()
  create(@Query('userId') userId: string, @Body() dto: CreateTrainerProfileDto) {
    return this.trainersService.create(userId, dto);
  }

  @Get()
  search(@Query() query: SearchTrainersDto) {
    return this.trainersService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.findOne(id);
  }
}