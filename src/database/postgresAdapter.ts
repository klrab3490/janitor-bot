import { Pool } from "pg";
import type { DbAdapter } from "./adapter";

/** Converts sqlite-style `?` placeholders to Postgres `$1, $2, ...`. */
function toPositional(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

export function createPostgresAdapter(connectionString: string): DbAdapter {
  const pool = new Pool({ connectionString });

  return {
    async run(sql, params = []) {
      const result = await pool.query(toPositional(sql), params);
      return { changes: result.rowCount ?? 0 };
    },
    async get(sql, params = []) {
      const result = await pool.query(toPositional(sql), params);
      return result.rows[0] as never;
    },
    async all(sql, params = []) {
      const result = await pool.query(toPositional(sql), params);
      return result.rows as never;
    },
    async exec(sql) {
      await pool.query(sql);
    },
  };
}
