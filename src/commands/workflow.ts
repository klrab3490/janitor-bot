import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { relayToN8n } from "./relay";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("workflow")
    .setDescription("Trigger an n8n workflow by name")
    .addStringOption((opt) => opt.setName("name").setDescription("Workflow name").setRequired(true)),
  async execute(interaction, container) {
    await relayToN8n(interaction, container, {
      name: interaction.options.getString("name", true),
    });
  },
};

export default command;
