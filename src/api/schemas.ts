import { z } from "zod";

export const connectSchema = z.object({
  pairingCode: z.string().min(1),
  webhookUrl: z.string().url(),
  apiKey: z.string().min(1),
});

export const disconnectSchema = z.object({
  guildId: z.string().min(1),
  apiKey: z.string().min(1),
});
