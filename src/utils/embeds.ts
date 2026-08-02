import { EmbedBuilder } from "discord.js";
import type { N8nCallResult } from "../types";

const COLOR_SUCCESS = 0x57f287;
const COLOR_ERROR = 0xed4245;
const COLOR_WARN = 0xfee75c;

export function successEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(COLOR_SUCCESS).setTitle(title).setDescription(description);
}

export function errorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(COLOR_ERROR).setTitle(title).setDescription(description);
}

export function warnEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder().setColor(COLOR_WARN).setTitle(title).setDescription(description);
}

const FAILURE_MESSAGES: Record<Exclude<N8nCallResult, { ok: true }>["reason"], string> = {
  not_connected: "This server isn't connected to an n8n workflow yet. Ask an admin to run `/connect`.",
  timeout: "The n8n workflow took too long to respond. Please try again shortly.",
  unauthorized: "Authentication with n8n failed. Ask an admin to reconnect with `/connect`.",
  not_found: "The n8n webhook URL couldn't be reached (404). Check the workflow is active.",
  server_error: "The n8n workflow returned a server error. Check the workflow logs.",
  unknown: "Something went wrong talking to n8n.",
};

/** Turns a failed N8nCallResult into a friendly Discord embed. */
export function n8nFailureEmbed(result: Extract<N8nCallResult, { ok: false }>): EmbedBuilder {
  return errorEmbed("Request failed", FAILURE_MESSAGES[result.reason]);
}

/** Renders a successful n8n response as an embed, falling back to a plain message. */
export function n8nResponseEmbed(result: Extract<N8nCallResult, { ok: true }>): EmbedBuilder {
  const { data } = result;
  if (data.embed) {
    const embed = new EmbedBuilder().setColor(data.embed.color ?? COLOR_SUCCESS);
    if (data.embed.title) embed.setTitle(data.embed.title);
    if (data.embed.description) embed.setDescription(data.embed.description);
    if (data.embed.fields) embed.addFields(data.embed.fields);
    return embed;
  }
  return successEmbed("Done", data.message ?? "Request completed.");
}
