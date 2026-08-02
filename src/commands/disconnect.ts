import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { successEmbed, warnEmbed } from "../utils/embeds";

const command: Command = {
  data: new SlashCommandBuilder().setName("disconnect").setDescription("Remove this server's connection to n8n"),
  adminOnly: true,
  async execute(interaction, container) {
    const removed = await container.connectionRepo.delete(interaction.guildId!);
    await interaction.reply({
      embeds: [
        removed
          ? successEmbed("Disconnected", "This server's n8n connection has been removed.")
          : warnEmbed("Nothing to do", "This server wasn't connected to n8n."),
      ],
      ephemeral: true,
    });
  },
};

export default command;
