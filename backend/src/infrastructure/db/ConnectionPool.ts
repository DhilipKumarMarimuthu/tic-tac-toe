import { Pool } from "pg";

/**
 * Shared PostgreSQL connection pool.
 */

export const connectionPool = new Pool({
    connectionString: process.env.DATABASE_URL
})