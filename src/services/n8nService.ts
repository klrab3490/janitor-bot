import axios, { AxiosError } from "axios";
import { createHmac } from "node:crypto";
import type { ConnectionRepository } from "../repositories/connectionRepository";
import type { EncryptionService } from "./encryptionService";
import type { CommandPayload, N8nCallResult } from "../types";
import { logger } from "../logger";

const REQUEST_TIMEOUT_MS = 10_000;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export class N8nService {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly encryptionService: EncryptionService
  ) {}

  async send(guildId: string, payload: CommandPayload): Promise<N8nCallResult> {
    const connection = await this.connectionRepo.findByGuildId(guildId);
    if (!connection) return { ok: false, reason: "not_connected" };

    const apiKey = this.encryptionService.decrypt(connection.api_key_encrypted);
    const body = JSON.stringify(payload);

    logger.info("Outgoing webhook", { guildId, command: payload.command });

    try {
      const response = await axios.post(connection.webhook_url, payload, {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-Janitor-Signature": sign(body, apiKey),
        },
      });
      logger.info("Webhook response", { guildId, status: response.status });
      return { ok: true, data: response.data };
    } catch (error) {
      return this.mapError(guildId, error);
    }
  }

  private mapError(guildId: string, error: unknown): N8nCallResult {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.code === "ECONNABORTED") {
        logger.warn("Webhook timeout", { guildId });
        return { ok: false, reason: "timeout" };
      }
      const status = axiosError.response?.status;
      logger.error("Webhook error", { guildId, status, message: axiosError.message });
      if (status === 401) return { ok: false, reason: "unauthorized" };
      if (status === 404) return { ok: false, reason: "not_found" };
      if (status && status >= 500) return { ok: false, reason: "server_error" };
      return { ok: false, reason: "unknown", detail: axiosError.message };
    }
    logger.error("Unexpected webhook error", { guildId, error });
    return { ok: false, reason: "unknown" };
  }
}
