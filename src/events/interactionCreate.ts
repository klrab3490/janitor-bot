import { Events, type Interaction } from "discord.js";
import type { BotEvent } from "./types";
import { isAdmin } from "../middleware/permissions";
import { errorEmbed } from "../utils/embeds";
import { logger } from "../logger";

const event: BotEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async execute(container, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      logger.warn("Unknown command invoked", { command: interaction.commandName });
      return;
    }

    if (command.adminOnly && !isAdmin(interaction)) {
      await interaction.reply({
        embeds: [errorEmbed("Permission denied", `Only administrators can use \`/${interaction.commandName}\`.`)],
        ephemeral: true,
      });
      return;
    }

    logger.info("Discord command", {
      command: interaction.commandName,
      guildId: interaction.guildId,
      userId: interaction.user.id,
    });

    try {
      await command.execute(interaction, container);
    } catch (error) {
      logger.error("Command execution failed", { command: interaction.commandName, error });
      const embed = errorEmbed("Unexpected error", "Something went wrong running that command.");
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};

export default event;
