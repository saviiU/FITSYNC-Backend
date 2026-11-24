import {
  Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  // TEMP: clientId comes from the query until JWT auth is merged
  // (then: the logged-in CLIENT).
  @Post('reviews')
  create(@Query('clientId', ParseUUIDPipe) clientId: string, @Body() dto: CreateReviewDto) {
    return this.service.create(clientId, dto);
  }

  @Get('trainers/:id/reviews')
  list(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByTrainer(id);
  }
}
