import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const sql = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(sql);
