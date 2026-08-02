import type { DbAdapter } from "../database/adapter";
import type { ConnectionRecord } from "../models";

export class ConnectionRepository {
  constructor(private readonly db: DbAdapter) {}

  async upsert(guildId: string, webhookUrl: string, apiKeyEncrypted: string): Promise<void> {
    await this.db.run(
      `INSERT INTO connections (guild_id, webhook_url, api_key_encrypted, connected_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(guild_id) DO UPDATE SET
         webhook_url = excluded.webhook_url,
         api_key_encrypted = excluded.api_key_encrypted,
         connected_at = excluded.connected_at`,
      [guildId, webhookUrl, apiKeyEncrypted, new Date().toISOString()]
    );
  }

  async findByGuildId(guildId: string): Promise<ConnectionRecord | undefined> {
    return this.db.get<ConnectionRecord>(`SELECT * FROM connections WHERE guild_id = ?`, [guildId]);
  }

  async delete(guildId: string): Promise<boolean> {
    const result = await this.db.run(`DELETE FROM connections WHERE guild_id = ?`, [guildId]);
    return result.changes > 0;
  }
}
