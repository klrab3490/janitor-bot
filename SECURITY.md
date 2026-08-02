# Security Policy

## Supported Versions

Only the latest released version of Janitor receives security fixes.

| Version  | Supported |
| -------- | --------- |
| latest   | ✅        |
| < latest | ❌        |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, use GitHub's private vulnerability reporting:

1. Go to the [Security tab](../../security/advisories/new) of this repository.
2. Click "Report a vulnerability".
3. Describe the issue, affected versions, and reproduction steps if possible.

You should receive an initial response within **5 business days**. We'll work
with you to understand and resolve the issue, and will credit you in the
advisory unless you'd prefer to remain anonymous.

## Scope

Janitor handles two categories of secrets you should be aware of when
reporting:

- **`ENCRYPTION_KEY`** — encrypts stored n8n API keys at rest (AES-256-GCM).
- **n8n API keys / webhook URLs** — stored encrypted per-guild, used to
  authenticate and sign (`X-Janitor-Signature`, HMAC-SHA256) outbound webhook
  calls.

Reports involving key handling, the pairing flow (`/connect`, `/api/connect`),
or webhook signing/verification are especially welcome.

## Disclosure Policy

We follow coordinated disclosure — please give us a reasonable window to ship
a fix before public disclosure.
