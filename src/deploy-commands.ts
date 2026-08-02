import { REST, Routes } from "discord.js";
import { env } from "./config/env";
import { loadCommands } from "./commands/loader";
import { logger } from "./logger";

async function main(): Promise<void> {
  const commands = loadCommands();
  const body = [...commands.values()].map((command) => command.data.toJSON());

  const rest = new REST().setToken(env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body });

  logger.info("Slash commands registered", { count: body.length });
}

main().catch((error) => {
  logger.error("Failed to register commands", { error });
  process.exit(1);
});
