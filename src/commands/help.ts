import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";
import { successEmbed } from "../utils/embeds";

const COMMAND_LIST = [
  ["/help", "Show this message"],
  ["/ping", "Check bot latency"],
  ["/connect", "(admin) Pair this server with an n8n instance"],
  ["/disconnect", "(admin) Remove this server's n8n connection"],
  ["/status", "Show this server's connection status"],
  ["/cleanup", "Run a cleanup workflow in n8n"],
  ["/workflow", "Trigger an n8n workflow"],
  ["/logs", "Fetch recent logs via n8n"],
  ["/server", "Get server info via n8n"],
  ["/docker", "Manage docker via n8n"],
]
  .map(([name, desc]) => `**${name}** — ${desc}`)
  .join("\n");

const command: Command = {
  data: new SlashCommandBuilder().setName("help").setDescription("List available Janitor commands"),
  async execute(interaction) {
    await interaction.reply({ embeds: [successEmbed("Janitor Commands", COMMAND_LIST)], ephemeral: true });
  },
};

export default command;
