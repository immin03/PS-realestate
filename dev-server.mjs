import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 8888);
const FUNCTIONS = process.env.FUNCTIONS_URL || "http://127.0.0.1:9000";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (url.pathname.startsWith("/.netlify/functions/")) {
    const fn = url.pathname.replace("/.netlify/functions/", "");
    const target = `${FUNCTIONS}/.netlify/functions/${fn}${url.search}`;
    try {
      const proxy = await fetch(target, { method: req.method });
      const body = Buffer.from(await proxy.arrayBuffer());
      const headers = { "Content-Type": proxy.headers.get("content-type") || "application/json" };
      res.writeHead(proxy.status, headers);
      res.end(body);
    } catch {
      res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(
        "Functions server unavailable. Run: npm run dev (or npm run dev:fn in another terminal)"
      );
    }
    return;
  }

  let path = join(ROOT, decodeURIComponent(url.pathname));
  try {
    const info = await stat(path);
    if (info.isDirectory()) path = join(path, "index.html");
  } catch {
    if (url.pathname !== "/") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    path = join(ROOT, "index.html");
  }

  try {
    const body = await readFile(path);
    res.writeHead(200, { "Content-Type": MIME[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(PORT, () => {
  console.log(`Dev server ready: http://localhost:${PORT}`);
});
