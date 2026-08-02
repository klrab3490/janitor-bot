import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z
  .object({
    DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
    CLIENT_ID: z.string().min(1, "CLIENT_ID is required"),
    DB_DRIVER: z.enum(["sqlite", "postgres"]).default("sqlite"),
    DATABASE_PATH: z.string().default("./data/janitor.sqlite"),
    DATABASE_URL: z.string().optional(),
    PORT: z.coerce.number().int().positive().default(3000),
    ENCRYPTION_KEY: z
      .string()
      .length(64, "ENCRYPTION_KEY must be a 64-char hex string (32 bytes). Generate with: openssl rand -hex 32"),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  })
  .refine((data) => data.DB_DRIVER !== "postgres" || !!data.DATABASE_URL, {
    message: "DATABASE_URL is required when DB_DRIVER=postgres (e.g. postgres://user:pass@localhost:5432/janitor)",
    path: ["DATABASE_URL"],
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
