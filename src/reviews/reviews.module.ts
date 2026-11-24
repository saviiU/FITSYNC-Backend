import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { SessionNote } from '../session-notes/session-note.entity';
import { TrainerProfile } from '../trainers/trainer-profile.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, SessionNote, TrainerProfile])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
