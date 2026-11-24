import {
  Column, CreateDateColumn, Entity, Index, JoinColumn,
  ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TrainerProfile } from '../trainers/trainer-profile.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  sessionNoteId: number;

  @Index()
  @Column({ type: 'int' })
  trainerProfileId: number;

  @ManyToOne(() => TrainerProfile)
  @JoinColumn({ name: 'trainerProfileId' })
  trainerProfile: TrainerProfile;

  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
