# Contributing to Janitor

Thanks for considering a contribution. This project follows [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow): branch from `main`, open a PR, get it reviewed, merge.

## Getting set up

```bash
git clone https://github.com/klrab3490/janitor-bot.git
cd janitor-bot
npm install
cp .env.example .env
npm run dev
```

## Before opening a PR

```bash
npm run lint
npm run format:check
npm run build
npm test
```

CI runs the same checks on every PR — fixing issues locally first saves round-trips.

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint:

```
<type>(<optional scope>): <description>

feat(commands): add /docker restart action
fix(n8n-service): handle ECONNREFUSED as offline, not unknown
docs(readme): clarify pairing flow
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `perf`. These drive automatic changelog generation and semantic version bumps, so accuracy matters more than style.

## Code style

- TypeScript, strict mode, no `any`.
- Business logic belongs in n8n, not in the bot — new commands should be thin relays (see `src/commands/relay.ts`) unless they're purely local (like `/ping`, `/status`).
- Repository pattern for data access — no raw SQL outside `src/repositories/`.
- Keep the dependency-injection container (`src/container.ts`) as the single wiring point; don't reach for a DI framework.
- Follow the existing dynamic command/event loader pattern — don't add a new command to a switch statement, add a file to `src/commands/`.

## Adding a command

1. Create `src/commands/yourcommand.ts` exporting a `Command` (see `src/commands/types.ts`).
2. If it should relay to n8n, use `relayToN8n()` from `src/commands/relay.ts`.
3. Run `npm run deploy-commands` to register it with Discord.
4. It's picked up automatically by the loader — no other file needs to change.

## Reporting bugs / requesting features

Use the issue templates. For security vulnerabilities, see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Pull requests

- Keep PRs focused — one logical change per PR.
- Reference the issue it closes (`Closes #123`) if applicable.
- Update `README.md`/`CHANGELOG.md` if user-facing behavior changes.
- A maintainer will review and may ask for changes before merging.

By contributing, you agree your contributions are licensed under the project's [MIT License](LICENSE).
