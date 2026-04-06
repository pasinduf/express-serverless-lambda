import { User } from './User.entity';
export declare class Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    userId: number | null;
    user: User | null;
    createdAt: Date;
    updatedAt: Date;
}
