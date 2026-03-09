import { Pool } from "pg";

/**
 * Shared PostgreSQL connection pool.
 */

export const ConnectionPool = new Pool({
    connectionString: process.env.DATABASE_URL
})