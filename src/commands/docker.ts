import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { relayToN8n } from "./relay";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("docker")
    .setDescription("Manage docker via n8n")
    .addStringOption((opt) =>
      opt
        .setName("action")
        .setDescription("Action to perform")
        .setRequired(true)
        .addChoices(
          { name: "status", value: "status" },
          { name: "restart", value: "restart" },
          { name: "logs", value: "logs" }
        )
    )
    .addStringOption((opt) => opt.setName("container").setDescription("Container name")),
  async execute(interaction, container) {
    await relayToN8n(interaction, container, {
      action: interaction.options.getString("action", true),
      container: interaction.options.getString("container") ?? undefined,
    });
  },
};

export default command;
