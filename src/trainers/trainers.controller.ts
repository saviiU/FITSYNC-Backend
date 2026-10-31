import { 
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,

 } from '@nestjs/common';

 import { TrainersService } from './trainers.service';
 import { TrainerProfile } from './trainer-profile.entity';

@Controller('trainers')
export class TrainersController {
    constructor(private readonly trainersService: TrainersService) {}

    @Post()
    create(@Body() data: Partial<TrainerProfile>) {
        return this.trainersService.create(data);
    }

    @Get()
    findAll() {
        return this.trainersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.trainersService.findOne(id);
    }
}
