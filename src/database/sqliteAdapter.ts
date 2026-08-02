import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { DbAdapter } from "./adapter";

export function createSqliteAdapter(path: string): DbAdapter {
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  return {
    async run(sql, params = []) {
      const result = db.prepare(sql).run(...params);
      return { changes: result.changes };
    },
    async get(sql, params = []) {
      return db.prepare(sql).get(...params) as never;
    },
    async all(sql, params = []) {
      return db.prepare(sql).all(...params) as never;
    },
    async exec(sql) {
      db.exec(sql);
    },
  };
}
