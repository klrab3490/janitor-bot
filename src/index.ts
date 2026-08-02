import { Client, GatewayIntentBits } from "discord.js";
import { env } from "./config/env";
import { logger } from "./logger";
import { createContainer } from "./container";
import { loadCommands } from "./commands/loader";
import { loadEvents } from "./events/loader";
import { startApiServer } from "./api/server";

async function main(): Promise<void> {
  const container = await createContainer();
  const commands = loadCommands();

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  loadEvents(client, container, commands);

  startApiServer(container);

  await client.login(env.DISCORD_TOKEN);
}

main().catch((error) => {
  logger.error("Fatal startup error", { error });
  process.exit(1);
});
