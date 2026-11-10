import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrainersService } from './trainers.service';
import { TrainerProfile } from './trainer-profile.entity';

describe('TrainersService', () => {
  let service: TrainersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TrainersService,
        {
          provide: getRepositoryToken(TrainerProfile),
          useValue: { findOne: async () => null },
        },
      ],
    }).compile();

    service = module.get(TrainersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne throws NotFoundException for unknown or unverified trainer', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});