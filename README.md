# Janitor

[![CI](https://github.com/OWNER/janitor-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/janitor-bot/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

**Janitor** is a Discord operations bot that bridges Discord to [n8n](https://n8n.io). It is not a cleanup bot — it's a thin, typed transport layer: Discord slash commands go in, an HTTP webhook call goes out to your n8n instance, and the response comes back as a Discord reply. **All business logic lives in your n8n workflows**, not in the bot.

## Why

Discord bots that embed business logic become unmaintainable fast — every new rule means a redeploy. Janitor inverts that: the bot never decides anything, it just relays. Change what `/cleanup` does by editing an n8n workflow, not by shipping code.

## Architecture

```
Discord slash command
      │
      ▼
Janitor bot (permission check, payload build)
      │  POST { guildId, channelId, userId, username, command, options, timestamp }
      ▼
Your n8n instance (webhook trigger → your workflow logic)
      │  JSON response { message | embed }
      ▼
Janitor bot formats an embed
      │
      ▼
Discord reply
```

Each Discord server (guild) pairs with its own n8n instance independently — there is no shared/global n8n endpoint.

## Features

- **Pairing system** — `/connect` (admin-only) generates a short-lived pairing code; you enter it into n8n once and the two are linked. No webhook URLs hardcoded anywhere.
- **Multi-guild** — every server has its own encrypted webhook URL + API key.
- **Dynamic command loading** — drop a file in `src/commands/`, it's registered. No switch statements.
- **SQLite or Postgres** — `DB_DRIVER=sqlite` (default, zero setup) or `DB_DRIVER=postgres` (point at your own instance).
- **Encrypted secrets** — API keys are AES-256-GCM encrypted at rest; webhook calls are HMAC-signed.
- **Friendly failure modes** — n8n offline, timeout, 401/404/500, not-configured, invalid pairing, missing permissions all render as clear Discord embeds instead of silent failures.
- **Structured logging** — every command → webhook → response → reply hop is logged (Winston).

## Requirements

- Node.js 22+
- A Discord application + bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- An n8n instance reachable from wherever the bot runs
- SQLite (default, no setup) or a Postgres database

## Quick start

```bash
git clone https://github.com/OWNER/janitor-bot.git
cd janitor-bot
npm install
cp .env.example .env   # fill in DISCORD_TOKEN, CLIENT_ID, ENCRYPTION_KEY
npm run deploy-commands # registers slash commands with Discord
npm run dev
```

Generate an encryption key:

```bash
openssl rand -hex 32
```

### Using Docker

```bash
docker compose up --build
# or, with a local Postgres instead of SQLite:
docker compose --profile postgres up --build
```

## Configuration

| Variable         | Required    | Default                 | Description                                                                             |
| ---------------- | ----------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `DISCORD_TOKEN`  | yes         | —                       | Bot token from the Discord Developer Portal                                             |
| `CLIENT_ID`      | yes         | —                       | Discord application (client) ID                                                         |
| `ENCRYPTION_KEY` | yes         | —                       | 64-char hex string (32 bytes), used to encrypt stored API keys — `openssl rand -hex 32` |
| `DB_DRIVER`      | no          | `sqlite`                | `sqlite` or `postgres`                                                                  |
| `DATABASE_PATH`  | no          | `./data/janitor.sqlite` | SQLite file path (used when `DB_DRIVER=sqlite`)                                         |
| `DATABASE_URL`   | if postgres | —                       | Postgres connection string, e.g. `postgres://user:pass@localhost:5432/janitor`          |
| `PORT`           | no          | `3000`                  | Port for the Express API that n8n calls back into                                       |
| `LOG_LEVEL`      | no          | `info`                  | `error` \| `warn` \| `info` \| `debug`                                                  |

## Commands

| Command       | Access | Description                                        |
| ------------- | ------ | -------------------------------------------------- |
| `/help`       | anyone | List available commands                            |
| `/ping`       | anyone | Check bot latency                                  |
| `/connect`    | admin  | Generate a pairing code to link this server to n8n |
| `/disconnect` | admin  | Remove this server's n8n connection                |
| `/status`     | anyone | Show this server's connection status               |
| `/cleanup`    | anyone | Relay to n8n — cleanup workflow                    |
| `/workflow`   | anyone | Relay to n8n — trigger a named workflow            |
| `/logs`       | anyone | Relay to n8n — fetch recent logs                   |
| `/server`     | anyone | Relay to n8n — server info                         |
| `/docker`     | anyone | Relay to n8n — docker status/restart/logs          |

## Pairing an n8n instance

1. An admin runs `/connect` in the target Discord server. Janitor replies (ephemerally) with a code like `84HF-29KA`, valid for 10 minutes.
2. In your n8n workflow, call:

   ```
   POST https://your-janitor-host/api/connect
   Content-Type: application/json

   {
     "pairingCode": "84HF-29KA",
     "webhookUrl": "https://your-n8n-instance/webhook/janitor",
     "apiKey": "a-secret-you-choose"
   }
   ```

3. From then on, every Janitor command in that guild POSTs to `webhookUrl` with an `Authorization: Bearer <apiKey>` header and an `X-Janitor-Signature` HMAC-SHA256 signature (signed with the same API key) so your workflow can verify the request came from Janitor.

Your n8n workflow should respond with:

```json
{ "message": "Done!" }
```

or, for a richer reply:

```json
{
  "embed": {
    "title": "Cleanup complete",
    "description": "Removed 42 messages.",
    "color": 5763719,
    "fields": [{ "name": "Channel", "value": "#general", "inline": true }]
  }
}
```

## REST API (called by n8n)

| Endpoint          | Method | Description                                 |
| ----------------- | ------ | ------------------------------------------- |
| `/api/connect`    | POST   | Complete a pairing (see above)              |
| `/api/disconnect` | POST   | Remove a connection (`{ guildId, apiKey }`) |
| `/health`         | GET    | Liveness check                              |
| `/version`        | GET    | Returns the running package version         |

## Development

```bash
npm run dev          # watch mode
npm run lint         # ESLint
npm run format       # Prettier (write)
npm test             # node:test smoke tests
npm run build        # compile to dist/
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project uses [Conventional Commits](https://www.conventionalcommits.org/), [Semantic Versioning](https://semver.org/), and [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow).

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities.

## License

[MIT](LICENSE)
