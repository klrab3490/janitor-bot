import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { relayToN8n } from "./relay";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Fetch recent logs via n8n")
    .addIntegerOption((opt) => opt.setName("lines").setDescription("Number of lines").setMinValue(1).setMaxValue(500)),
  async execute(interaction, container) {
    await relayToN8n(interaction, container, {
      lines: interaction.options.getInteger("lines") ?? 50,
    });
  },
};

export default command;
