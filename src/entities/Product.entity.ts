import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'integer', nullable: true })
    userId!: number | null;

    @ManyToOne(() => User, (user) => user.products, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user!: User | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
