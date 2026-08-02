import type { ChatInputCommandInteraction } from "discord.js";
import type { Container } from "../container";
import type { CommandPayload } from "../types";
import { n8nFailureEmbed, n8nResponseEmbed } from "../utils/embeds";

/** Builds the standard payload, forwards it to n8n, and replies with the result. Shared by every command whose logic lives in n8n. */
export async function relayToN8n(
  interaction: ChatInputCommandInteraction,
  container: Container,
  options: Record<string, unknown> = {}
): Promise<void> {
  if (!interaction.guildId) {
    await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  const payload: CommandPayload = {
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    userId: interaction.user.id,
    username: interaction.user.username,
    command: interaction.commandName,
    options,
    timestamp: new Date().toISOString(),
  };

  const result = await container.n8nService.send(interaction.guildId, payload);
  const embed = result.ok ? n8nResponseEmbed(result) : n8nFailureEmbed(result);
  await interaction.editReply({ embeds: [embed] });
}
