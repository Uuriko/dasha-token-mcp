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
| awesome-mcp-servers PR | https://github.com/punkpeye/awesome-mcp-servers/pull/15005 — Finance & Fintech entry, opened 2026-09-24 (agent fast-track `🤖🤖🤖`; awaiting maintainer merge) |
| Cline MCP Marketplace | https://github.com/cline/mcp-marketplace/issues/2623 — server-submission issue filed 2026-09-24 (logo.png committed to repo) |
| OKX.AI ASP kit | `okx-asp/` — manifest draft + avatar + owner steps prepared (not submitted) |
| mcpfind.org submission | `mcpfind-submission.yml` — prepared, ready to file (blocked on npm publish: their liveness check requires the package on the registry) |

## Prepared, needs a tap

| Surface | Need |
|---|---|
| npm publish `@uuriko/dasha-token-mcp` | John/npm-owner: `npm login` on this machine or publish from theirs. **Unlocks:** mcpfind submission (liveness check), Glama quality score, official registry publish |
| Official MCP Registry `io.github.Uuriko/dasha-token-mcp` | After npm publish: `mcp-publisher login github` (device auth) then publish. **Unlocks:** PulseMCP + playbooks.com auto-ingest |
| Smithery (smithery.ai/new) | John's sign-in (Google/GitHub/Email) — web flow or `smithery auth login` CLI, then publish repo URL |
| Glama (glama.ai) | John's GitHub OAuth sign-in, then "Add MCP Server" (name, repo URL, description 10–400 chars). Would let the awesome-mcp entry carry a score badge |
| CoinGecko info update | John's CoinGecko login → Partners Platform → "Update Coin or Token Info" (token already listed as `dash_eats`; needs ownership proof). DexScreener/Birdeye pick up CoinGecko metadata automatically |
| mcpservers.org/submit | Browser form fill (Server Name, Category=Finance, Short Description, Repository URL, registry name optional, remote-connections unchecked; may ask contact email — leave blank unless required). No account |
| mcp.so/submit | Browser form fill (Repository URL* + Name; auto-indexes rest). No login visible; 403s bots so a real browser agent must do it |
| OKX.AI listing | John's email login to the Agentic Wallet + a public HTTPS MCP endpoint (repo is stdio-only today; hosting is a new-infrastructure decision) |
| cursor.directory / mcp.directory / mcpm.sh / Anthropic Connectors | John's sign-in / org tier |
| ClawStreet | Dropped per John's explicit 2026-09-24 directive ("nvm on claw street") — no join, no entry, no payment |
| Virtuals Protocol / Liquidity Arena 2026 | Official community channel not yet verified; no posting until then |

## Skipped

| Surface | Why |
|---|---|
| Tantive | No existing credential/config found; no new account per zero-tap rules |
| Moltbook | Retired 2026-09-22 per John's directive |
| X posts | Needs John's explicit send authority/session |
| PulseMCP | Submissions paused since 2026-09-03 ("not accepting new MCP server submissions right now"). Fallback: official registry publish → auto-ingest |
| modelcontextprotocol/servers community list | Retired 2026-04-14 (now 7 official reference servers only) |
| DexScreener / GeckoTerminal / Birdeye info updates | Paid routes only (Enhanced Token Info / Fast Pass / Fast Track); no free path. Fix metadata on CoinGecko instead |
