export interface GuildRecord {
  guild_id: string;
  guild_name: string;
  created_at: string;
}

export interface ConnectionRecord {
  guild_id: string;
  webhook_url: string;
  api_key_encrypted: string;
  connected_at: string;
}

export interface PairingRecord {
  code: string;
  guild_id: string;
  expires_at: string;
  created_at: string;
}
