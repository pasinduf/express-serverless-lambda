import { Request, Response, NextFunction } from 'express';
import { Role } from '../entities/User.entity';
export interface JwtPayload {
    userId: number;
    email: string;
    role: Role;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Optional authentication middleware: populates req.user if token is valid,
 * but allows the request to continue if the token is missing.
 */
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authorize: (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
