import type { DbAdapter } from "../database/adapter";
import type { PairingRecord } from "../models";

export class PairingRepository {
  constructor(private readonly db: DbAdapter) {}

  async create(code: string, guildId: string, expiresAt: string): Promise<void> {
    await this.db.run(`INSERT INTO pairings (code, guild_id, expires_at, created_at) VALUES (?, ?, ?, ?)`, [
      code,
      guildId,
      expiresAt,
      new Date().toISOString(),
    ]);
  }

  async findValidByCode(code: string): Promise<PairingRecord | undefined> {
    return this.db.get<PairingRecord>(`SELECT * FROM pairings WHERE code = ? AND expires_at > ?`, [
      code,
      new Date().toISOString(),
    ]);
  }

  async deleteByGuildId(guildId: string): Promise<void> {
    await this.db.run(`DELETE FROM pairings WHERE guild_id = ?`, [guildId]);
  }

  async deleteExpired(): Promise<void> {
    await this.db.run(`DELETE FROM pairings WHERE expires_at <= ?`, [new Date().toISOString()]);
  }
}
