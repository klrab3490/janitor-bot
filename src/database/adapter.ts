export interface DbAdapter {
  run(sql: string, params?: unknown[]): Promise<{ changes: number }>;
  get<T>(sql: string, params?: unknown[]): Promise<T | undefined>;
  all<T>(sql: string, params?: unknown[]): Promise<T[]>;
  exec(sql: string): Promise<void>;
}

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,
    guild_name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS connections (
    guild_id TEXT PRIMARY KEY REFERENCES guilds(guild_id) ON DELETE CASCADE,
    webhook_url TEXT NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    connected_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pairings (
    code TEXT PRIMARY KEY,
    guild_id TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`;
