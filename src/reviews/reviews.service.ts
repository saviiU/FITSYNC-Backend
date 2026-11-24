import {
  ConflictException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { SessionNote } from '../session-notes/session-note.entity';
import { TrainerProfile } from '../trainers/trainer-profile.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(SessionNote) private readonly notes: Repository<SessionNote>,
    @InjectRepository(TrainerProfile) private readonly profiles: Repository<TrainerProfile>,
  ) {}

  // TODO: once Savindu's Booking entity is merged, check the booking is COMPLETED.
  async create(clientId: string, dto: CreateReviewDto) {
    const note = await this.notes.findOne({ where: { id: dto.sessionNoteId } });
    if (!note) throw new NotFoundException('Session not found');
    if (note.clientId !== clientId) {
      throw new ForbiddenException('You can only review your own sessions');
    }

    const existing = await this.reviews.findOne({ where: { sessionNoteId: dto.sessionNoteId } });
    if (existing) throw new ConflictException('This session was already reviewed');

    const profile = await this.profiles.findOne({ where: { userId: note.trainerId } });
    if (!profile) throw new NotFoundException('Trainer profile not found');

    const review = await this.reviews.save(
      this.reviews.create({
        sessionNoteId: dto.sessionNoteId,
        clientId,
        trainerProfileId: profile.id,
        rating: dto.rating,
        comment: dto.comment,
      }),
    );

    const agg = await this.reviews
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.trainerProfileId = :id', { id: profile.id })
      .getRawOne();
    profile.averageRating = Number(Number(agg.avg).toFixed(2));
    profile.reviewCount = Number(agg.count);
    await this.profiles.save(profile);

    return review;
  }

  findByTrainer(trainerProfileId: number) {
    return this.reviews
      .createQueryBuilder('r')
      .leftJoin('r.client', 'c')
      .addSelect(['c.id', 'c.name'])
      .where('r.trainerProfileId = :id', { id: trainerProfileId })
      .orderBy('r.createdAt', 'DESC')
      .getMany();
  }
}
