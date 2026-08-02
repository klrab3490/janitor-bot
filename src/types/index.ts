export interface CommandPayload {
  guildId: string;
  channelId: string;
  userId: string;
  username: string;
  command: string;
  options: Record<string, unknown>;
  timestamp: string;
}

export interface N8nResponse {
  success: boolean;
  message?: string;
  embed?: {
    title?: string;
    description?: string;
    color?: number;
    fields?: { name: string; value: string; inline?: boolean }[];
  };
}

export type N8nCallResult =
  | { ok: true; data: N8nResponse }
  | {
      ok: false;
      reason: "not_connected" | "timeout" | "unauthorized" | "not_found" | "server_error" | "unknown";
      detail?: string;
    };
