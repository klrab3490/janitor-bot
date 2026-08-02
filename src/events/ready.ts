import { Events, type Client } from "discord.js";
import type { BotEvent } from "./types";
import { logger } from "../logger";

const event: BotEvent<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute(_container, client: Client<true>) {
    logger.info("Janitor is online", { tag: client.user.tag, guilds: client.guilds.cache.size });
  },
};

export default event;
