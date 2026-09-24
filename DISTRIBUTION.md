# Distribution

Where the `dasha-token-mcp` kit is listed or submitted, and what is still needed.
Factual, infrastructure tone everywhere: no price talk, no predictions, no investment language.

## Canonical facts (reuse for every submission)

- **Name:** dasha-token-mcp
- **Tagline:** Read-only MCP server: $dasha (Solana) token data for trading agents
- **Repo:** https://github.com/Uuriko/dasha-token-mcp
- **License:** Apache-2.0
- **Runtime:** Node stdio, zero dependencies, no API key, no auth
- **Tools:** `get_price`, `get_liquidity`, `get_market_stats`, `get_swap_quote`
  (Dexscreener data + read-only Jupiter quotes; no wallets, no signing, nothing submitted on-chain)
- **Risk disclosure (always include):** thin liquidity (~$56k total across Raydium/Meteora pools),
  high volatility, single dominant pool, data staleness possible.
- **Token facts:** `TOKEN.md` in the repo (mint `53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump`, Solana).
- **Registry name (prepared):** `io.github.Uuriko/dasha-token-mcp` — publication pending npm publish.

## Landed

| Surface | Result |
|---|---|
| The Colony (`general`) | https://thecolony.ai/post/3a5fa8a4-1fc4-4934-8613-45dbf8bb8241 — posted 2026-09-24 |
| SSSNACK (`general`) | https://sssnack.com/s/6e010a1e-16f0-42fa-a0d9-45dc71bf134f — thread posted 2026-09-24 |
| Fruitflies | https://fruitflies.ai/post/4370bd08-aaa3-41fa-96eb-4da9099d97a9 — posted 2026-09-24T02:35:24Z |
| awesome-mcp-servers PR | Finance & Fintech entry — PR opened 2026-09-24 (awaiting maintainer merge; agent fast-track `🤖🤖🤖` used) |
| OKX.AI ASP kit | `okx-asp/` — manifest draft + avatar + owner steps prepared (not submitted) |

## Prepared, needs a tap

| Surface | Need |
|---|---|
| npm publish `@uuriko/dasha-token-mcp` | John/npm-owner: `npm login` on this machine or publish from theirs |
| Official MCP Registry `io.github.Uuriko/dasha-token-mcp` | After npm publish: `mcp-publisher login github` (device auth) then publish |
| mcpservers.org/submit | Browser form fill (fields: Server Name, Category=Finance, Short Description, Repository URL, Official MCP Registry Name optional, remote-connections unchecked). No account needed per form. |
| Smithery / Glama / PulseMCP / mcp.so | Exact submission mechanics unverified; likely account or browser form — browser delegation with the canonical facts above |
| OKX.AI listing | John's email login to the Agentic Wallet + a public HTTPS MCP endpoint (repo is stdio-only today; hosting is a new-infrastructure decision) |
| ClawStreet | Verify current free paper-trading tier via official material before any post; no paid contest entry |
| Virtuals Protocol / Liquidity Arena 2026 | Official community channel not yet verified; no posting until then |

## Skipped

| Surface | Why |
|---|---|
| Tantive | No existing credential/config found; no new account per zero-tap rules |
| Moltbook | Retired 2026-09-22 per John's directive |
| X posts | Needs John's explicit send authority/session |
