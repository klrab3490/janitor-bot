import { Router } from "express";
import type { Container } from "../container";
import { connectSchema, disconnectSchema } from "./schemas";
import { logger } from "../logger";
import { version as PACKAGE_VERSION } from "../../package.json";

export function createApiRouter(container: Container): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  router.get("/version", (_req, res) => {
    res.json({ version: PACKAGE_VERSION });
  });

  router.post("/connect", async (req, res) => {
    const parsed = connectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_request", details: parsed.error.flatten().fieldErrors });
    }

    const { pairingCode, webhookUrl, apiKey } = parsed.data;
    const guildId = await container.pairingService.consumePairing(pairingCode);
    if (!guildId) {
      return res.status(400).json({ error: "invalid_pairing_code" });
    }

    const encrypted = container.encryptionService.encrypt(apiKey);
    await container.connectionRepo.upsert(guildId, webhookUrl, encrypted);

    logger.info("Guild connected via API", { guildId });
    res.json({ success: true, guildId });
  });

  router.post("/disconnect", async (req, res) => {
    const parsed = disconnectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_request", details: parsed.error.flatten().fieldErrors });
    }

    const { guildId, apiKey } = parsed.data;
    const connection = await container.connectionRepo.findByGuildId(guildId);
    if (!connection) {
      return res.status(404).json({ error: "not_connected" });
    }

    const storedKey = container.encryptionService.decrypt(connection.api_key_encrypted);
    if (storedKey !== apiKey) {
      return res.status(401).json({ error: "unauthorized" });
    }

    await container.connectionRepo.delete(guildId);
    logger.info("Guild disconnected via API", { guildId });
    res.json({ success: true });
  });

  return router;
}
