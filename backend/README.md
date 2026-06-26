# BoredOut API — Cloudflare Workers + D1

The backend is a [Hono](https://hono.dev) app running on **Cloudflare Workers**, with
**D1** (Cloudflare's SQLite) as the database. No server to manage, no cold starts, free tier.

## What you need
- Node 18+ and npm
- A free Cloudflare account (https://dash.cloudflare.com/sign-up)

Everything below is run from inside this `backend/` folder.

---

## One-time setup

### 1. Install dependencies
```
cd backend
npm install
```

### 2. Log in to Cloudflare
```
npx wrangler login
```
This opens your browser — click **Allow**.

### 3. Create the database
```
npx wrangler d1 create boredout
```
It prints a block like:
```
[[d1_databases]]
binding = "DB"
database_name = "boredout"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
Copy the `database_id` value and paste it into **`wrangler.toml`**, replacing
`REPLACE_WITH_DATABASE_ID_FROM_WRANGLER`.

### 4. Set the JWT secret (production)
This signs login tokens. Use a long random string.
```
npx wrangler secret put JWT_SECRET
```
Paste your secret when prompted.

For **local dev**, also copy `.dev.vars.example` to `.dev.vars` and put any value in it:
```
JWT_SECRET="some-long-random-dev-string"
```
(`.dev.vars` is git-ignored — never commit real secrets.)

### 5. Create the tables and demo data
Run against the **remote** (production) database:
```
npm run db:schema:remote
npm run db:seed:remote
```
(Drop `:remote` to do the same against a local copy for `wrangler dev`.)

---

## Run it locally
```
npm run dev
```
Serves the API at `http://localhost:8787`. Quick check:
```
curl http://localhost:8787/health
```
The frontend already points at `http://localhost:8787` when you open it from `localhost`.

## Deploy
```
npm run deploy
```
Wrangler prints your live URL, e.g.:
```
https://boredout-api.your-subdomain.workers.dev
```

### Final wiring
1. Open `../api.js` and replace `https://boredout-api.YOUR-SUBDOMAIN.workers.dev`
   with the URL Wrangler just printed.
2. Commit + push so Netlify redeploys the frontend.

That's it — the live site now talks to your Worker.

---

## Handy commands
| Command | What it does |
|---|---|
| `npm run dev` | Local dev server on :8787 |
| `npm run deploy` | Deploy the Worker |
| `npm run db:schema:remote` | Apply `schema.sql` to production D1 |
| `npm run db:seed:remote` | Load demo people + activities into production D1 |
| `npx wrangler tail` | Live-stream production logs |
| `npx wrangler d1 execute boredout --remote --command "SELECT COUNT(*) FROM users"` | Run a one-off query |

## Notes
- **Demo people are bots** (`is_bot = 1`, no password) and cannot be logged into — they only
  populate the People/Quick-match/Friends screens and reply in chat after ~2 seconds.
- Timestamps are stored as **unix epoch seconds**; array fields (`interests`, `people`,
  `badges`, `xp_log`) are stored as **JSON text**.
- Re-running the seed is safe (idempotent — explicit ids + `INSERT OR IGNORE`).
