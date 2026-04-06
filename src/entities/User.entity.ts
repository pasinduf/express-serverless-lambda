import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from './Product.entity';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    role!: Role;

    @OneToMany(() => Product, (product) => product.user)
    products!: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
