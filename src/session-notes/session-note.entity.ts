import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('session_notes')
export class SessionNote {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'int' })
    bookingId: number;

    @Column({ type: 'uuid' })
    trainerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'trainerId' })
    trainer: User;

    @Index()
    @Column({ type: 'uuid' })
    clientId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'clientId' })
    client: User;

    @Column({ type: 'text' })
    notes: string;

    @Column({ type: 'text', nullable: true })
    recommendations: string;

    @Column({ type: 'jsonb', nullable: true })
    metrics: Record<string, number>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}