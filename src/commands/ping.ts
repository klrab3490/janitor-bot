import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types";

const command: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check if Janitor is online and responsive"),
  async execute(interaction) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Latency: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`);
  },
};

export default command;
