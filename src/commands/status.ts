import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { successEmbed, warnEmbed } from "../utils/embeds";

const command: Command = {
  data: new SlashCommandBuilder().setName("status").setDescription("Show this server's n8n connection status"),
  async execute(interaction, container) {
    if (!interaction.guildId) {
      await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
      return;
    }

    const connection = await container.connectionRepo.findByGuildId(interaction.guildId);
    await interaction.reply({
      embeds: [
        connection
          ? successEmbed(
              "Connected",
              `Webhook: \`${connection.webhook_url}\`\nConnected <t:${Math.floor(new Date(connection.connected_at).getTime() / 1000)}:R>.`
            )
          : warnEmbed("Not connected", "Run `/connect` (admin only) to pair this server with n8n."),
      ],
      ephemeral: true,
    });
  },
};

export default command;
