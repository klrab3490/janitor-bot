import type { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandBuilder } from "discord.js";
import type { Container } from "../container";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  adminOnly?: boolean;
  execute(interaction: ChatInputCommandInteraction, container: Container): Promise<void>;
}
