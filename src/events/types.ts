import type { ClientEvents } from "discord.js";
import type { Container } from "../container";

export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute(container: Container, ...args: ClientEvents[K]): Promise<void> | void;
}
