import type { Collection } from "discord.js";
import type { Command } from "../commands/types";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
