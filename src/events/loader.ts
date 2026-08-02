import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Client } from "discord.js";
import type { Collection } from "discord.js";
import type { Command } from "../commands/types";
import type { Container } from "../container";
import type { BotEvent } from "./types";
import { logger } from "../logger";

export function loadEvents(client: Client, container: Container, commands: Collection<string, Command>): void {
  const dir = __dirname;
  const files = readdirSync(dir).filter(
    (file) =>
      (file.endsWith(".ts") || file.endsWith(".js")) &&
      !["loader.ts", "loader.js", "types.ts", "types.js"].includes(file)
  );

  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic plugin-style loading
    const mod = require(join(dir, file));
    const event: BotEvent = mod.default ?? mod;
    if (!event?.name || typeof event.execute !== "function") {
      logger.warn("Skipping invalid event file", { file });
      continue;
    }

    const handler = (...args: unknown[]) =>
      (event.execute as (container: Container, ...rest: unknown[]) => unknown)(container, ...args);
    if (event.once) client.once(event.name, handler);
    else client.on(event.name, handler);
  }

  // interactionCreate needs the loaded commands collection; attach it for that handler to read.
  client.commands = commands;

  logger.info("Events loaded", { count: files.length });
}
