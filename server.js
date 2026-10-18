// candor-hello: one file, one dependency (pg).
const http = require("node:http");
const { Pool } = require("pg");

const VERSION = "v1"; // change this line, commit, push: watch the page update
const PORT = process.env.PORT || 8080;
const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

let ready = false;
async function init() {
  if (!db) return;
  await db.query(
    "CREATE TABLE IF NOT EXISTS visits (id bigserial PRIMARY KEY, at timestamptz NOT NULL DEFAULT now())"
  );
  ready = true;
}

async function countVisit() {
  if (!db || !ready) return null;
  await db.query("INSERT INTO visits DEFAULT VALUES");
  const { rows } = await db.query("SELECT count(*)::int AS n FROM visits");
  return rows[0].n;
}

const page = (visits) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>candor-hello ${VERSION}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0d10;color:#e8eaed;
       font:16px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
  main{text-align:center} .v{font-size:20px;opacity:.7} .t{font-size:56px;margin:12px 0}
  .n{font-size:28px} .n b{font-size:40px}
</style></head><body><main>
  <div class="v">candor-hello · ${VERSION}</div>
  <div class="t" id="t">--:--:--</div>
  <div class="n">${visits === null ? "no database attached" : `visits: <b>${visits}</b>`}</div>
</main>
<script>
  // Ticks from the server's clock, so a live page proves the app is answering.
  async function tick(){ try{ const r=await fetch('/api/now'); const j=await r.json();
    document.getElementById('t').textContent=new Date(j.now).toLocaleTimeString(); }catch(e){} }
  tick(); setInterval(tick,1000);
</script></body></html>`;

http
  .createServer(async (req, res) => {
    try {
      if (req.url === "/api/now") {
        res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
        return res.end(JSON.stringify({ now: new Date().toISOString(), version: VERSION }));
      }
      if (req.url === "/healthz") { res.writeHead(200); return res.end("ok"); }
      if (req.url !== "/") { res.writeHead(404); return res.end("not found"); }
      const visits = await countVisit();
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      res.end(page(visits));
    } catch (err) {
      console.error(JSON.stringify({ level: "error", msg: err.message }));
      res.writeHead(500); res.end("error");
    }
  })
  .listen(PORT, () => console.log(JSON.stringify({ level: "info", msg: `candor-hello ${VERSION} listening on ${PORT}` })));

init().catch((err) => console.error(JSON.stringify({ level: "error", msg: `db init failed: ${err.message}` })));
