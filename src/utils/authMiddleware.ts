import { MiddlewareFn } from 'type-graphql';
import { GraphQLContext } from '../utils/context';
import jwt from 'jsonwebtoken';

export const isAuthenticated: MiddlewareFn<GraphQLContext> = async (
    { context },
    next,
) => {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
        throw new Error('Not authenticated!');
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        context.user = payload as { id: number; role: string }; // Assign user details to context
    } catch (err) {
        throw new Error('Invalid token!');
    }

    return next();
};
