import { PermissionFlagsBits, type ChatInputCommandInteraction } from "discord.js";

export function isAdmin(interaction: ChatInputCommandInteraction): boolean {
  if (!interaction.inGuild()) return false;
  return interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) ?? false;
}
