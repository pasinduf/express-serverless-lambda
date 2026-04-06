import { Product } from './Product.entity';
export declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    role: Role;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
