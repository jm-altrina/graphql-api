import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "NOT SET");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

// Validate environment variables
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PORT) {
  throw new Error("Missing required database environment variables.");
}

// Create the database pool
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD as string, // Ensure password is a string
  port: Number(process.env.DB_PORT),
});

// Test database connection
export const connectDatabase = async () => {
  try {
    await pool.connect();
    console.log("Connected to the database!");
  } catch (err) {
    // Narrow down the type of 'err' to properly handle it
    if (err instanceof Error) {
      console.error("Database connection failed:", err.message);
    } else {
      console.error("An unknown error occurred during database connection.");
    }
    process.exit(1); // Exit process on failure
  }
};