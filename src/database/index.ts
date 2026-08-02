import { env } from "../config/env";
import { logger } from "../logger";
import { SCHEMA, type DbAdapter } from "./adapter";
import { createSqliteAdapter } from "./sqliteAdapter";
import { createPostgresAdapter } from "./postgresAdapter";

export async function createDb(): Promise<DbAdapter> {
  const db =
    env.DB_DRIVER === "postgres" ? createPostgresAdapter(env.DATABASE_URL!) : createSqliteAdapter(env.DATABASE_PATH);

  await db.exec(SCHEMA);
  logger.info("Database ready", { driver: env.DB_DRIVER });
  return db;
}
