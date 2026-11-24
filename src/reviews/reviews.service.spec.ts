import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { SessionNote } from '../session-notes/session-note.entity';
import { TrainerProfile } from '../trainers/trainer-profile.entity';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let note: Partial<SessionNote> | null;
  let existingReview: Partial<Review> | null;
  let profile: Partial<TrainerProfile> | null;

  const aggQb = {
    select: () => aggQb,
    addSelect: () => aggQb,
    where: () => aggQb,
    getRawOne: async () => ({ avg: '4.5', count: '2' }),
  };

  beforeEach(async () => {
    note = { id: 1, clientId: 'client-1', trainerId: 'trainer-1' };
    existingReview = null;
    profile = { id: 7, userId: 'trainer-1', averageRating: 0, reviewCount: 0 };

    const module = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: {
            findOne: async () => existingReview,
            create: (r: Partial<Review>) => r,
            save: async (r: Partial<Review>) => r,
            createQueryBuilder: () => aggQb,
          },
        },
        {
          provide: getRepositoryToken(SessionNote),
          useValue: { findOne: async () => note },
        },
        {
          provide: getRepositoryToken(TrainerProfile),
          useValue: {
            findOne: async () => profile,
            save: async (p: Partial<TrainerProfile>) => p,
          },
        },
      ],
    }).compile();

    service = module.get(ReviewsService);
  });

  it('throws NotFound when the session does not exist', async () => {
    note = null;
    await expect(service.create('client-1', { sessionNoteId: 1, rating: 5 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('blocks a client from reviewing another clients session', async () => {
    await expect(service.create('client-2', { sessionNoteId: 1, rating: 5 })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('blocks a second review of the same session', async () => {
    existingReview = { id: 1 };
    await expect(service.create('client-1', { sessionNoteId: 1, rating: 5 })).rejects.toThrow(
      ConflictException,
    );
  });

  it('saves the review and updates the trainer rating', async () => {
    const result = await service.create('client-1', { sessionNoteId: 1, rating: 4, comment: 'Good' });
    expect(result.rating).toBe(4);
    expect(profile?.averageRating).toBe(4.5);
    expect(profile?.reviewCount).toBe(2);
  });
});