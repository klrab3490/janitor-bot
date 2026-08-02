import type { DbAdapter } from "../database/adapter";
import type { GuildRecord } from "../models";

export class GuildRepository {
  constructor(private readonly db: DbAdapter) {}

  async upsert(guildId: string, guildName: string): Promise<void> {
    await this.db.run(
      `INSERT INTO guilds (guild_id, guild_name, created_at) VALUES (?, ?, ?)
       ON CONFLICT(guild_id) DO UPDATE SET guild_name = excluded.guild_name`,
      [guildId, guildName, new Date().toISOString()]
    );
  }

  async findById(guildId: string): Promise<GuildRecord | undefined> {
    return this.db.get<GuildRecord>(`SELECT * FROM guilds WHERE guild_id = ?`, [guildId]);
  }
}
