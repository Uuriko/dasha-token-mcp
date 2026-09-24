#!/usr/bin/env node
/**
 * dasha-token-mcp — read-only MCP server (stdio) for $dasha (dasha) market data.
 *
 * Tools:
 *   get_price        — current USD + SOL price, 24h change (Dexscreener, no key)
 *   get_liquidity    — per-pair and total USD liquidity (Dexscreener, no key)
 *   get_market_stats — market cap, FDV, 24h volume, 24h txns (Dexscreener, no key)
 *   get_swap_quote   — read-only Jupiter quote for dasha <-> SOL (no signing, no wallet)
 *
 * No tool here signs transactions, holds keys, or submits anything on-chain.
 * Protocol: JSON-RPC 2.0 over stdio, newline-delimited (MCP 2024-11-05).
 */

const TOKEN_MINT = "53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const DASHA_DECIMALS = 6; // verified: 1e9 raw units = 1000 dasha against Dexscreener priceUsd
const DEXSCREENER_URL = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_MINT}`;
const JUP_QUOTE_URL = "https://lite-api.jup.ag/swap/v1/quote";
const FETCH_TIMEOUT_MS = 15000;

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
  return res.json();
}

function mainPair(pairs) {
  if (!pairs?.length) throw new Error("Dexscreener returned no pairs for this token");
  return [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const TOOLS = [
  {
    name: "get_price",
    description: "Current $dasha (dasha) price in USD and SOL plus 24h price change. Read-only, via Dexscreener public API.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_liquidity",
    description: "USD liquidity per trading pair and total across pairs for $dasha. Read-only, via Dexscreener public API.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_market_stats",
    description: "Market cap, FDV, 24h volume and 24h transaction counts for $dasha. Read-only, via Dexscreener public API.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_swap_quote",
    description:
      "Read-only swap quote for $dasha <-> SOL via Jupiter's public quote API. Returns expected output, price impact and route. " +
      "Does NOT sign or submit any transaction; the caller must build and sign separately.",
    inputSchema: {
      type: "object",
      properties: {
        direction: {
          type: "string",
          enum: ["dasha_to_sol", "sol_to_dasha"],
          description: "Trade direction.",
        },
        amount: {
          type: "string",
          description: "Human-readable amount in the input token's units (e.g. \"1000\" = 1000 dasha, \"0.1\" = 0.1 SOL).",
        },
        slippage_bps: {
          type: "number",
          description: "Slippage tolerance in basis points (default 100 = 1%).",
          default: 100,
        },
      },
      required: ["direction", "amount"],
      additionalProperties: false,
    },
  },
];

function toRawUnits(amountStr, decimals) {
  const [whole, frac = ""] = String(amountStr).split(".");
  if (!/^\d+$/.test(whole) || !/^\d*$/.test(frac)) throw new Error(`Invalid amount: ${amountStr}`);
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole + fracPadded).toString();
}

async function callTool(name, args = {}) {
  switch (name) {
    case "get_price": {
      const data = await fetchJson(DEXSCREENER_URL);
      const p = mainPair(data.pairs);
      return {
        token: { symbol: "dasha", name: p.baseToken?.name, mint: TOKEN_MINT, chain: "solana" },
        price_usd: num(p.priceUsd),
        price_sol: num(p.priceNative),
        change_24h_pct: num(p.priceChange?.h24),
        pair: { dex: p.dexId, pair_address: p.pairAddress, url: p.url },
        fetched_at: new Date().toISOString(),
      };
    }
    case "get_liquidity": {
      const data = await fetchJson(DEXSCREENER_URL);
      const pairs = (data.pairs ?? []).map((p) => ({
        dex: p.dexId,
        pair_address: p.pairAddress,
        liquidity_usd: num(p.liquidity?.usd),
        base_reserve: num(p.liquidity?.base),
        quote_reserve_sol: num(p.liquidity?.quote),
      }));
      const total = pairs.reduce((s, p) => s + (p.liquidity_usd ?? 0), 0);
      return { pairs, total_liquidity_usd: total, fetched_at: new Date().toISOString() };
    }
    case "get_market_stats": {
      const data = await fetchJson(DEXSCREENER_URL);
      const p = mainPair(data.pairs);
      return {
        market_cap_usd: num(p.marketCap),
        fdv_usd: num(p.fdv),
        volume_24h_usd: num(p.volume?.h24),
        txns_24h: { buys: p.txns?.h24?.buys ?? null, sells: p.txns?.h24?.sells ?? null },
        change_24h_pct: num(p.priceChange?.h24),
        fetched_at: new Date().toISOString(),
      };
    }
    case "get_swap_quote": {
      const { direction, amount, slippage_bps = 100 } = args;
      if (!["dasha_to_sol", "sol_to_dasha"].includes(direction)) {
        throw new Error(`direction must be dasha_to_sol or sol_to_dasha, got: ${direction}`);
      }
      const inputMint = direction === "dasha_to_sol" ? TOKEN_MINT : SOL_MINT;
      const outputMint = direction === "dasha_to_sol" ? SOL_MINT : TOKEN_MINT;
      const inDecimals = direction === "dasha_to_sol" ? DASHA_DECIMALS : 9;
      const outDecimals = direction === "dasha_to_sol" ? 9 : DASHA_DECIMALS;
      const inAmount = toRawUnits(amount, inDecimals);
      const q = new URLSearchParams({
        inputMint, outputMint, amount: inAmount,
        slippageBps: String(Math.max(0, Math.floor(slippage_bps))),
      });
      const quote = await fetchJson(`${JUP_QUOTE_URL}?${q}`);
      const outAmount = Number(quote.outAmount) / 10 ** outDecimals;
      return {
        direction,
        in_amount: amount,
        in_token: direction === "dasha_to_sol" ? "dasha" : "SOL",
        out_amount: outAmount,
        out_token: direction === "dasha_to_sol" ? "SOL" : "dasha",
        price_impact_pct: num(quote.priceImpactPct),
        route: (quote.routePlan ?? []).map((r) => r?.swapInfo?.label).filter(Boolean),
        slippage_bps: quote.slippageBps,
        note: "Quote only. Nothing was signed or submitted.",
        fetched_at: new Date().toISOString(),
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ---- Minimal JSON-RPC 2.0 / MCP stdio transport ----

function respond(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}
function respondError(id, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32000, message } }) + "\n");
}

async function handle(msg) {
  const { id, method, params } = msg;
  try {
    switch (method) {
      case "initialize":
        respond(id, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "dasha-token-mcp", version: "1.0.0" },
        });
        break;
      case "notifications/initialized":
        break; // no response for notifications
      case "tools/list":
        respond(id, { tools: TOOLS });
        break;
      case "tools/call": {
        const result = await callTool(params?.name, params?.arguments ?? {});
        respond(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
        break;
      }
      default:
        respondError(id, `Unsupported method: ${method}`);
    }
  } catch (err) {
    respondError(id, err?.message ?? String(err));
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      handle(JSON.parse(line));
    } catch (err) {
      respondError(null, `Invalid JSON-RPC message: ${err.message}`);
    }
  }
});
