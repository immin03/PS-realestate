const MAX_ITEMS = 8;
const STORE_KEY = "ps_shared_recent";

let memoryFallback = [];

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, X-PS-Access",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    },
    body: body == null ? "" : JSON.stringify(body)
  };
}

function getExpectedAccessCode() {
  return String(process.env.ACCESS_CODE || process.env.PS_ACCESS_CODE || "").trim();
}

function isAuthorized(event) {
  const expected = getExpectedAccessCode();
  if (!expected) return true;
  const q = event.queryStringParameters || {};
  const header = event.headers?.["x-ps-access"] || event.headers?.["X-PS-Access"] || "";
  const code = String(q.code || header || "").trim();
  return code && code.toUpperCase() === expected.toUpperCase();
}

function normalizeEntry(item) {
  if (!item || typeof item !== "object") return null;
  const addr = String(item.addr || "").trim();
  if (!addr) return null;
  const addrKey = String(item.addrKey || addr.replace(/\s+/g, " ").trim()).trim();
  return {
    addr,
    addrKey,
    context: item.context && typeof item.context === "object" ? item.context : null
  };
}

function dedupeEntries(list) {
  const out = [];
  const seen = new Set();
  for (const raw of list || []) {
    const entry = normalizeEntry(raw);
    if (!entry || seen.has(entry.addrKey)) continue;
    seen.add(entry.addrKey);
    out.push(entry);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

async function getBlobStore() {
  try {
    const { getStore } = require("@netlify/blobs");
    return getStore({ name: "ps-recent-searches", consistency: "strong" });
  } catch {
    return null;
  }
}

async function readList(store) {
  if (!store) return dedupeEntries(memoryFallback);
  try {
    const data = await store.get(STORE_KEY, { type: "json" });
    const list = dedupeEntries(Array.isArray(data) ? data : []);
    memoryFallback = [...list];
    return list;
  } catch (error) {
    console.warn("recent-searches read failed:", error.message);
    return dedupeEntries(memoryFallback);
  }
}

async function writeList(store, list) {
  const trimmed = dedupeEntries(list);
  memoryFallback = [...trimmed];
  if (!store) return trimmed;
  try {
    await store.setJSON(STORE_KEY, trimmed);
  } catch (error) {
    console.warn("recent-searches write failed:", error.message);
  }
  return trimmed;
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, null);
  }

  if (!isAuthorized(event)) {
    return json(403, { ok: false, message: "접속 코드가 필요합니다." });
  }

  const store = await getBlobStore();

  if (event.httpMethod === "GET") {
    const items = await readList(store);
    return json(200, { ok: true, items, max: MAX_ITEMS });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, message: "GET 또는 POST만 지원합니다." });
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { ok: false, message: "JSON 본문이 필요합니다." });
  }

  const action = String(body.action || "save").trim();
  const current = await readList(store);

  if (action === "remove") {
    const addrKey = String(body.addrKey || "").trim();
    if (!addrKey) {
      return json(400, { ok: false, message: "addrKey가 필요합니다." });
    }
    const items = await writeList(store, current.filter(e => e.addrKey !== addrKey));
    return json(200, { ok: true, items, max: MAX_ITEMS });
  }

  if (action === "replace") {
    const items = await writeList(store, dedupeEntries(body.items || []));
    return json(200, { ok: true, items, max: MAX_ITEMS });
  }

  const entry = normalizeEntry(body.entry || body);
  if (!entry) {
    return json(400, { ok: false, message: "유효한 entry(addr)가 필요합니다." });
  }

  const items = await writeList(store, [entry, ...current.filter(e => e.addrKey !== entry.addrKey)]);
  return json(200, { ok: true, items, max: MAX_ITEMS });
};
