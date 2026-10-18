# candor-hello

The smallest app we use to demo [Candor Deploy](https://candordeploy.com/?utm_source=github&utm_medium=readme&utm_campaign=candor-hello): one page that shows the server's clock ticking live and a visit counter stored in Postgres.

**Push your code. We run the servers.**

## Deploy it on Candor Deploy
1. Fork this repo.
2. In the portal at deploy.candorhost.com, connect GitHub, pick your fork and click **Detect**.
   Candor sees a Node app (`package.json` with a start script) and the `pg` driver, so it offers a Postgres database alongside it.
3. Click **Deploy**. When it's live, open the app's address. The clock ticks and every refresh adds a visit.

Or ask your AI coding agent: "deploy this to Candor." See [Deploy from Claude](https://candordeploy.com/docs/connect-claude/?utm_source=github&utm_medium=readme&utm_campaign=candor-hello).

## Try a change
Edit the `VERSION` line in `server.js`, commit and push. The page shows the new version once it's live.

## How it works
- `server.js` uses Node's built-in `http` module. Its one dependency is `pg`.
- It listens on `PORT` (Candor sets it; 8080 if unset).
- It reads the database from `DATABASE_URL`, which Candor fills in when the database is attached. With no database it still runs and says "no database attached".
- On start it creates one table, `visits`. `/api/now` returns the server time, and `/healthz` returns `ok`.

## Run it locally
```
npm install
DATABASE_URL=postgres://localhost/candor_hello npm start
```

No secrets live in this repo, and none should be added. `.env` files are git-ignored.

MIT licensed. Maintained by the Candor Deploy team.
