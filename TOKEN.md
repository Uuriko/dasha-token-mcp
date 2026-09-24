# $dasha — machine-readable token facts for AI agents

This file is for agents evaluating or trading the $dasha token programmatically.
Infrastructure facts only. Nothing here is investment advice or a price prediction.

## Identity

- chain: solana
- symbol: dasha
- name: dash_eats
- mint (verified 2026-09-24 via Dexscreener token lookup): `53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump`
- decimals: 6
- CoinGecko coin id: `dash_eats`
- project website: https://www.getdasha.com
- project X: https://x.com/dash_eats

## Listings (verified)

- Dexscreener: https://dexscreener.com/solana/9kkdpvuqrqxjiuymfcy1cwqrxlwdcggur2cap2qt7bu7
- GeckoTerminal: search mint `53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump`
- Jupiter: routable via the public quote API below (routes through the Raydium pool)
- CoinGecko: coin id `dash_eats`

## Trading pairs (observed 2026-09-24)

- primary: Raydium dasha/SOL — pair `9KkDpvUQRqXjiuyMFcy1CwqrxLwDcGGUR2Cap2Qt7bU7`
- secondary: Meteora DLMM dasha/SOL — pair `46hZ1oT95ikC4kvxb5pXcxMe64Nte5hJ8XQoTD8jqiFr` (very thin, ~$477)

## How to get a quote (no key needed)

Jupiter public quote endpoint:

```
GET https://lite-api.jup.ag/swap/v1/quote
  ?inputMint=53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump
  &outputMint=So11111111111111111111111111111111111111112
  &amount=<raw units, 6 decimals for dasha>
  &slippageBps=100
```

Example: sell 1000 dasha for SOL.

```
curl "https://lite-api.jup.ag/swap/v1/quote?inputMint=53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump&outputMint=So11111111111111111111111111111111111111112&amount=1000000000&slippageBps=100"
```

Notes:
- This is a quote only. Building and signing the swap transaction is the caller's job.
- The legacy `quote-api.jup.ag/v6/quote` endpoint was unreachable at time of writing; use `lite-api.jup.ag/swap/v1/quote`.
- Always re-quote immediately before executing; quotes go stale in seconds.

## How to read market data (no key needed)

```
GET https://api.dexscreener.com/latest/dex/tokens/53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump
```

Returns pairs with priceUsd, priceNative, liquidity.usd, volume, txns, priceChange, marketCap, fdv.

## Utility (why the token exists)

$dasha is the payment rail for Dasha Compute, a decentralized marketplace for
Mac-based AI compute (inference, fine-tuning workloads). Demand mechanics:

- providers earn per job; payouts taken in $dasha receive a +5% bonus
- compute credits and fees are intended to be quotable and payable in $dasha

This is infrastructure, not a claim about future value.

## Risks (read before touching it)

- Thin liquidity: total observed liquidity ~$56k across pairs. Expect high slippage
  on any non-trivial size. Size positions accordingly and check priceImpactPct on
  every quote.
- High volatility: small market cap (~$186k observed) means large percentage moves
  on small volume. 24h change was -15.46% at time of writing.
- Single dominant pool: nearly all liquidity sits in one Raydium pool. If that
  pool drains or is manipulated, price discovery breaks.
- Data staleness: Dexscreener aggregates on a delay; verify with a fresh quote
  before acting.
- Smart-contract / custody risk: standard Solana token-program risk applies.
  The token mint and freeze authorities are reported revoked (supply immutable);
  verify independently via an RPC `getAccountInfo` on the mint if this matters
  to your strategy.

## Companion MCP server

`dasha-token-mcp/` in this kit exposes the same data as MCP tools over stdio:

- `get_price` — USD + SOL price, 24h change
- `get_liquidity` — per-pair and total USD liquidity
- `get_market_stats` — market cap, FDV, 24h volume, 24h txns
- `get_swap_quote` — read-only Jupiter quote (dasha <-> SOL)

No tool signs transactions or holds keys. See `dasha-token-mcp/README.md`.
