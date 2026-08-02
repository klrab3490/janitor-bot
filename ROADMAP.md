# Roadmap

This reflects current direction, not commitments — priorities shift based on
contributor availability and community feedback. Discuss changes via issues
before starting large work.

## Now

- Stabilize the pairing + connection flow across SQLite and Postgres.
- Harden webhook error handling (retries/backoff for transient n8n failures).

## Next

- Redis-backed pairing/session store as an alternative to SQL for high-traffic
  deployments.
- Per-command rate limiting.
- Multi-webhook routing (different n8n workflows per command, not just per
  guild).

## Later

- Web dashboard for connection status and logs, separate from Discord.
- Official Helm chart / Kubernetes manifests alongside the existing Docker
  Compose setup.
- Plugin system for community-contributed commands beyond the current
  dynamic-loader model.

## Out of scope

- Business logic in the bot itself. Janitor stays a thin relay to n8n by
  design — see the README's "Why" section.
