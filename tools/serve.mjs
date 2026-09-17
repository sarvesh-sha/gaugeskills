/**
 * Local preview server.
 *
 * The deployed site is static files on GitHub Pages, so this exists only to
 * review the build the way a browser will see it — extensionless URLs, real
 * relative paths, no file:// restrictions. It is not part of the build and
 * nothing here ships.
 *
 * Usage: `npm run serve`, then open http://localhost:4173
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/** Resolve a request path to a file, trying `.html` the way Pages does. */
async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const base = path.join(ROOT, clean);

  // Reject anything that escapes the project root.
  if (!base.startsWith(ROOT)) return null;

  for (const candidate of [
    clean === "" ? path.join(ROOT, "index.html") : base,
    `${base}.html`,
    path.join(base, "index.html"),
  ]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

const server = createServer(async (req, res) => {
  const file = (await resolveFile(req.url ?? "/")) ?? path.join(ROOT, "404.html");
  const found = !file.endsWith("404.html") || req.url === "/404.html";

  res.writeHead(found ? 200 : 404, {
    "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });

  createReadStream(file)
    .on("error", () => res.end())
    .pipe(res);
});

server.listen(PORT, () => {
  console.log(`preview: http://localhost:${PORT}`);
});
