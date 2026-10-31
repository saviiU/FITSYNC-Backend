import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerProfile } from './trainer-profile.entity';


@Injectable()
export class TrainersService {
    constructor(
        @InjectRepository(TrainerProfile)
        private readonly trainerRepository: Repository<TrainerProfile>,
    ) {}

    async create(data: Partial<TrainerProfile>): Promise<TrainerProfile> {
        const trainer = this.trainerRepository.create(data);
        return this.trainerRepository.save(trainer);

    }

    async findAll(): Promise<TrainerProfile[]> {
        return this.trainerRepository.find({
            relations: {
                user: true,
            },
        });
    }

    async findOne(id: number): Promise<TrainerProfile> {
        const trainer = await this.trainerRepository.findOne({
            where: {id},
            relations: {
                user: true,
            },
        });

        if (!trainer) {
            throw new NotFoundException(`Trainer with ID ${id} not found`);
        }

        return trainer;
    }
}

