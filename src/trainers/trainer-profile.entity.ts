import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity('trainer_profiles')
export class TrainerProfile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userId: string;

    @OneToOne(() => User )
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: '' })
    specialization: string;

    @Column({ type: 'int', default: 0 })
    experienceYears: number;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'text', nullable: true })
    certification: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    sessionFee: number;

    @Column({ default: '' })
    location: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    averageRating: number;

    @Column({ type: 'int', default: 0 })
    reviewCount: number;

    @Column({ type: 'text', nullable: true })
    photoUrl: string;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
}