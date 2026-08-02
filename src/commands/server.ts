import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { relayToN8n } from "./relay";

const command: Command = {
  data: new SlashCommandBuilder().setName("server").setDescription("Get server info via n8n"),
  async execute(interaction, container) {
    await relayToN8n(interaction, container);
  },
};

export default command;
