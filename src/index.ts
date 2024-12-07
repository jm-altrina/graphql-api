import 'reflect-metadata';
import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

import { connectDatabase } from './db';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { createSchema } from './schema/schema';
import jwt from 'jsonwebtoken';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await connectDatabase();
        logger.info("Connected to the database!");

        const schema = await createSchema();

        app.use(
            '/graphql',
            createHandler({
                schema,
                async context(req, params) {
                    const authHeader = typeof req.headers.get === "function" ? req.headers.get("authorization") : null;

                    let user = null;

                    if (authHeader) {
                        const token = authHeader.split(" ")[1]; // Extract the token
                        try {
                            const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: number; role: string };
                            user = payload; // Attach user info to the context
                        } catch (err) {
                            console.error("Invalid token:", err);
                        }
                    }

                    return {
                        req,
                        user, // Include user info in the context
                    };
                },
            }),
        );

        app.listen(PORT, () =>
            logger.info(`Server running on http://localhost:${PORT}/graphql`),
        );
    } catch (err) {
        if (err instanceof Error) {
            console.error("Connection failed:", err.message);
        } else {
            console.error("An unknown error occurred during connection.");
        }
    }
})();
