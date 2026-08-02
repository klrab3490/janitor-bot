import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { relayToN8n } from "./relay";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("cleanup")
    .setDescription("Run a cleanup workflow")
    .addIntegerOption((opt) =>
      opt.setName("amount").setDescription("Number of messages to clean up").setMinValue(1).setMaxValue(1000)
    ),
  async execute(interaction, container) {
    await relayToN8n(interaction, container, {
      amount: interaction.options.getInteger("amount") ?? undefined,
    });
  },
};

export default command;
