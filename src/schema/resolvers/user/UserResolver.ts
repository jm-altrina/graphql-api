import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../../db";
import { QueryResult } from "pg";
import { RegisterInput, LoginInput } from "./UserInput.type";

interface TokenPayload {
  userId: number;
  role: string;
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => String)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput
  ): Promise<string> {
    const { username, password, role } = data;
    
    const existingUser: QueryResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if ((existingUser.rowCount ?? 0) > 0) { // Using fallback for rowCount
      throw new Error("Username already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
      [username, hashedPassword, role]
    );

    return "User registered successfully!";
  }

  @Mutation(() => String)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput
  ): Promise<string> {
    const { username, password } = data;

    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (!user.rows[0]) {
      throw new Error("Invalid username or password.");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      throw new Error("Invalid username or password.");
    }

    const payload: TokenPayload = {
      userId: user.rows[0].id,
      role: user.rows[0].role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    return token;
  }
}