# OKX.AI Agent Service Provider — submission kit (prepared, not submitted)

List `dasha-token-mcp` on OKX.AI as a **free A2MCP** Agent Service Provider.
Free tier only — no x402 paid billing.

## What's ready

- `asp-manifest.json` — draft answers for every registration prompt
  (identity name, description ≤500 chars, four services, fee `0`).
- `avatar.webp` — square avatar (76 KB, under the 1 MB limit), image file as required.

## Owner steps (needs John's tap — email login + approval)

1. On a machine with an agent that supports skills (Claude Code, OpenClaw, Hermes, Codex):
   `npx skills add okx/onchainos-skills --yes -g`
2. `Log in to Agentic Wallet on Onchain OS with my email` — **John's email login**.
3. `Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS`
   — answer prompts from `asp-manifest.json`; upload `avatar.webp` when asked.
4. `Help me list my ASP on OKX.AI using Onchain OS`
5. Review lands within ~24h to the wallet email. Until approval, the service is
   reachable via its Agent ID.

## Blockers (both John's call)

1. **Public HTTPS MCP endpoint.** A2MCP requires a permanent public `https://`
   endpoint that returns results directly. This repo ships a stdio server; it needs
   an SSE/streamable-HTTP wrapper hosted somewhere before listing. Hosting is a
   new-infrastructure decision — not done here.
2. **Email login.** The Agentic Wallet login needs John's email + approval.

## Rules for this listing

- Free tier only. No x402, no pay-per-call, no receiving wallet.
- No price talk, no predictions, no investment language — infrastructure tone.
- The service is read-only: no wallets, no signing, nothing submitted on-chain.
