import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Collection } from "discord.js";
import type { Command } from "./types";
import { logger } from "../logger";

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>();
  const dir = __dirname;
  const files = readdirSync(dir).filter(
    (file) =>
      (file.endsWith(".ts") || file.endsWith(".js")) &&
      !["loader.ts", "loader.js", "types.ts", "types.js"].includes(file)
  );

  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic plugin-style loading
    const mod = require(join(dir, file));
    const command: Command = mod.default ?? mod;
    if (!command?.data?.name || typeof command.execute !== "function") {
      logger.warn("Skipping invalid command file", { file });
      continue;
    }
    commands.set(command.data.name, command);
  }

  logger.info("Commands loaded", { count: commands.size, commands: [...commands.keys()] });
  return commands;
}
