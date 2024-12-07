import { Request } from 'express';

export interface GraphQLContext {
    req: Request;
    user?: { id: number; role: string }; // Extend as needed
}
