#!/usr/bin/env node
// Spawns server.mjs and calls each tool over JSON-RPC stdio. Prints results.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const child = spawn("node", [path.join(dir, "server.mjs")], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
const pending = new Map();
let nextId = 1;
child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buf += chunk;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id != null && pending.has(msg.id)) pending.get(msg.id)(msg);
  }
});

function send(method, params) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}

function notify(method) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method }) + "\n");
}

const results = [];
async function check(label, fn) {
  try {
    const value = await fn();
    results.push({ label, ok: true, value });
    console.log(`PASS ${label}`);
  } catch (err) {
    results.push({ label, ok: false, error: err.message });
    console.log(`FAIL ${label}: ${err.message}`);
  }
}

function toolText(resp) {
  if (resp.error) throw new Error(`tool error: ${resp.error.message}`);
  return JSON.parse(resp.result.content[0].text);
}

const init = await send("initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "verify", version: "0.0.0" },
});
notify("notifications/initialized");
console.log("server:", init.result.serverInfo.name, init.result.serverInfo.version);

const list = await send("tools/list", {});
console.log("tools:", list.result.tools.map((t) => t.name).join(", "));

await check("get_price", async () => {
  const r = toolText(await send("tools/call", { name: "get_price", arguments: {} }));
  if (!(r.price_usd > 0)) throw new Error("no price_usd");
  if (r.token.mint !== "53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump") throw new Error("mint mismatch");
  return r;
});
await check("get_liquidity", async () => {
  const r = toolText(await send("tools/call", { name: "get_liquidity", arguments: {} }));
  if (!(r.total_liquidity_usd > 0)) throw new Error("no liquidity");
  return r;
});
await check("get_market_stats", async () => {
  const r = toolText(await send("tools/call", { name: "get_market_stats", arguments: {} }));
  if (!(r.market_cap_usd > 0)) throw new Error("no market cap");
  return r;
});
await check("get_swap_quote dasha_to_sol", async () => {
  const r = toolText(
    await send("tools/call", { name: "get_swap_quote", arguments: { direction: "dasha_to_sol", amount: "1000" } })
  );
  if (!(r.out_amount > 0)) throw new Error("no out_amount");
  return r;
});
await check("get_swap_quote sol_to_dasha", async () => {
  const r = toolText(
    await send("tools/call", { name: "get_swap_quote", arguments: { direction: "sol_to_dasha", amount: "0.1" } })
  );
  if (!(r.out_amount > 0)) throw new Error("no out_amount");
  return r;
});
await check("get_swap_quote invalid direction rejected", async () => {
  const resp = await send("tools/call", { name: "get_swap_quote", arguments: { direction: "x", amount: "1" } });
  if (!resp.error) throw new Error("expected an error");
  return { error: resp.error.message };
});

console.log("\n--- full results ---");
console.log(JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok).length;
child.kill();
process.exit(failed ? 1 : 0);
