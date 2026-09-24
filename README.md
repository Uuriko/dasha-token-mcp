# dasha-token-mcp

Read-only MCP server (stdio) exposing **$dasha** (`dasha`, Solana) market data to AI agents.

## Tools

| Tool | Source | Description |
|---|---|---|
| `get_price` | Dexscreener | USD + SOL price, 24h change |
| `get_liquidity` | Dexscreener | per-pair and total USD liquidity |
| `get_market_stats` | Dexscreener | market cap, FDV, 24h volume, 24h txns |
| `get_swap_quote` | Jupiter lite API | read-only dasha <-> SOL quote |

No tool signs transactions, holds keys, or submits anything on-chain.

## Install

```bash
npm install -g @uuriko/dasha-token-mcp
```

Or run from source (Node >= 18, no dependencies):

```bash
node server.mjs        # stdio JSON-RPC, MCP 2024-11-05
node verify.mjs        # live end-to-end check of all tools
```

## Use with an MCP client

```json
{
  "mcpServers": {
    "dasha-token": {
      "command": "npx",
      "args": ["-y", "@uuriko/dasha-token-mcp"]
    }
  }
}
```

## `get_swap_quote` arguments

- `direction`: `dasha_to_sol` | `sol_to_dasha`
- `amount`: human-readable input amount, e.g. `"1000"` (dasha) or `"0.1"` (SOL)
- `slippage_bps`: optional, default 100

Quotes are read-only. Building and signing the swap transaction is the caller's job — always re-quote immediately before executing.

## Token facts

Machine-readable token facts (contract, listings, pairs, utility, risks) live in
[TOKEN.md](TOKEN.md). Infrastructure facts only — nothing there is investment
advice or a price prediction.

## Risks (read before touching it)

- Thin liquidity: total observed liquidity ~$56k across pairs. Expect high slippage on any non-trivial size.
- High volatility: small market cap (~$186k observed 2026-09-24) means large percentage moves on small volume.
- Single dominant pool: nearly all liquidity sits in one Raydium pool.

## Registry

`server.json` is prepared for the MCP Registry as `io.github.Uuriko/dasha-token-mcp`
(validated with `mcp-publisher validate`). Publishing awaits the npm package
release — see the tap list in the distribution report.

## License

Apache-2.0 — see [LICENSE](LICENSE).
