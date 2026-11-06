import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerProfile } from './trainer-profile.entity';
import { CreateTrainerProfileDto } from './dto/create-trainer-profile.dto';
import { SearchTrainersDto } from './dto/search-trainers.dto';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(TrainerProfile)
    private readonly repo: Repository<TrainerProfile>,
  ) {}

  async create(userId: string, dto: CreateTrainerProfileDto) {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) throw new ConflictException('Trainer profile already exists');
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  async search(q: SearchTrainersDto) {
    const { specialization, location, minRating, maxFee, sortBy, page = 1, limit = 10 } = q;

    const qb = this.repo
      .createQueryBuilder('t')
      .where('t.isVerified = :verified', { verified: true });

    if (specialization) qb.andWhere('t.specialization ILIKE :s', { s: `%${specialization}%` });
    if (location) qb.andWhere('t.location ILIKE :l', { l: `%${location}%` });
    if (minRating !== undefined) qb.andWhere('t.averageRating >= :r', { r: minRating });
    if (maxFee !== undefined) qb.andWhere('t.sessionFee <= :f', { f: maxFee });

    const sortColumns: Record<'rating' | 'fee' | 'experience', string> = {
     rating: 't.averageRating',
     fee: 't.sessionFee',
     experience: 't.experienceYears',
    };
    
    const key: 'rating' | 'fee' | 'experience' = sortBy ?? 'rating';
    qb.orderBy(sortColumns[key], key === 'fee' ? 'ASC' : 'DESC');

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const profile = await this.repo.findOne({ where: { id, isVerified: true } });
    if (!profile) throw new NotFoundException('Trainer not found');
    return profile;
  }
}