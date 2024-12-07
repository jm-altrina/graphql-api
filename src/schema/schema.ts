import { buildSchema } from 'type-graphql';
import { authChecker } from "./authChecker";
import { CourseResolver } from './resolvers/course/CourseResolver';
import { UserResolver } from './resolvers/user/UserResolver';

export const createSchema = async () => {
    return await buildSchema({
        resolvers: [CourseResolver, UserResolver], // All resolvers goes here
        authChecker,
    });
};
