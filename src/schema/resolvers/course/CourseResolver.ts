import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { Course } from "../../entities/Course";
import { pool } from "../../../db";

@Resolver(Course)
export class CourseResolver {
    @Query(() => [Course])
    async courses(
        @Arg("limit", () => Number, { nullable: true }) limit?: number,
        @Arg("sortOrder", () => String, { nullable: true }) sortOrder: "ASC" | "DESC" = "ASC"
    ): Promise<Course[]> {
        const validatedSortOrder = sortOrder === "DESC" ? "DESC" : "ASC";

        const result = await pool.query(
            `SELECT * FROM courses ORDER BY id ${validatedSortOrder} LIMIT $1`,
            [limit || 100]
        );
        return result.rows;
    }

    @Query(() => Course, { nullable: true })
    async course(@Arg("id", () => Number) id: number): Promise<Course | null> {
        const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
        return result.rows[0] || null;
    }

    @Mutation(() => Course)
    @Authorized(["ADMIN"]) // Restrict mutation to ADMIN role
    async addCourse(
        @Arg("title", () => String) title: string,
        @Arg("description", () => String) description: string,
        @Arg("duration", () => String) duration: string,
        @Arg("outcome", () => String) outcome: string
    ): Promise<Course> {
        const result = await pool.query(
            "INSERT INTO courses (title, description, duration, outcome) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, duration, outcome]
        );
        return result.rows[0];
    }

    @Mutation(() => Course)
    @Authorized(["ADMIN"])
    async updateCourse(
        @Arg("id", () => Number) id: number,
        @Arg("title", () => String, { nullable: true }) title?: string,
        @Arg("description", () => String, { nullable: true }) description?: string,
        @Arg("duration", () => String, { nullable: true }) duration?: string,
        @Arg("outcome", () => String, { nullable: true }) outcome?: string
    ): Promise<Course> {
        const updates = [];
        const values = [];

        if (title) {
            updates.push("title = $1");
            values.push(title);
        }
        if (description) {
            updates.push("description = $2");
            values.push(description);
        }
        if (duration) {
            updates.push("duration = $3");
            values.push(duration);
        }
        if (outcome) {
            updates.push("outcome = $4");
            values.push(outcome);
        }

        if (updates.length === 0) {
            throw new Error("No updates provided");
        }

        values.push(id); // Add ID as the last parameter
        const result = await pool.query(
            `UPDATE courses SET ${updates.join(", ")} WHERE id = $${updates.length + 1} RETURNING *`,
            values
        );

        if (!result.rows.length) {
            throw new Error(`Course with ID ${id} not found`);
        }

        return result.rows[0];
    }

    @Mutation(() => Boolean)
    @Authorized(["ADMIN"])
    async deleteCourse(@Arg("id", () => Number) id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            throw new Error(`Course with ID ${id} not found`);
        }

        return true;
    }
}