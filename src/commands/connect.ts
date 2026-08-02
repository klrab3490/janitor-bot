import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { successEmbed } from "../utils/embeds";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Generate a pairing code to connect this server to n8n"),
  adminOnly: true,
  async execute(interaction, container) {
    const { code, expiresAt } = await container.pairingService.createPairing(
      interaction.guildId!,
      interaction.guild?.name ?? "Unknown Server"
    );

    await interaction.reply({
      embeds: [
        successEmbed(
          "Pairing code generated",
          `Enter this code in your n8n Janitor node:\n\n\`${code}\`\n\nExpires <t:${Math.floor(expiresAt.getTime() / 1000)}:R>.`
        ),
      ],
      ephemeral: true,
    });
  },
};

export default command;
