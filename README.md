# myBackend

A small Express + TypeScript API that returns JSON.

Two endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Confirms the server is alive |
| GET | `/api/v1/books` | Returns a list of books |
| GET | `/api/v1/books/:id` | Returns one book, or 404 |

Data is hard-coded in `src/data/booksData.ts` — there is no database yet.

---

## Requirements

- **Node.js 24+** — the app runs TypeScript directly, no build step needed in dev
- **pnpm** — package manager

## Setup

```bash
pnpm install
cp .env.example .env
```

## Run

```bash
pnpm dev
```

```
server is running on port: 3000
```

Open <http://localhost:3000/health>. Edit any file and the server restarts by itself.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Run `src/server.ts` with hot reload, loading `.env` |
| `pnpm typecheck` | Check types only — emits nothing |
| `pnpm build` | Compile `src/` into `dist/` |
| `pnpm start` | Run the compiled build (`dist/server.js`) — requires `pnpm build` first |

> `pnpm dev` does **not** type-check. It strips types and runs. Use `pnpm typecheck` for real type safety.

---

## API

### `GET /health`

```bash
curl -i http://localhost:3000/health
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ok","message":"Server is healthy","timestamp":"2026-11-12T11:09:00.003Z"}
```

### `GET /api/v1/books`

```bash
curl -i http://localhost:3000/api/v1/books
```

```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "The Pragmatic Programmer", "author": "Andrew Hunt", "year": 1999, "genre": "Engineering", "available": true }
  ]
}
```

### `GET /api/v1/books/:id`

```bash
curl -i http://localhost:3000/api/v1/books/1
```

| Case | URL | Status | Body |
| --- | --- | --- | --- |
| Found | `/api/v1/books/1` | `200` | `{ "success": true, "data": {...} }` |
| Missing | `/api/v1/books/999` | `404` | `{ "success": false, "error": "No Book with id 999" }` |
| Bad id | `/api/v1/books/abc` | `400` | `{ "success": false, "error": "Id must be a number" }` |
| Unknown route | `/api/v1/nope` | `404` | `{ "success": false, "error": "Route not found" }` |

Every response is JSON — including errors. Success and failure always use the same shape: `success` plus either `data` or `error`.

---

## Project structure

```
src/
  server.ts                     entry point: reads PORT, calls listen()
  app.ts                        builds the Express app, mounts routers, JSON 404
  modules/
    books/
      books.routes.ts           URL  ->  controller
      books.controller.ts       request/response handling
      books.service.ts          data access
    health/
      health.routes.ts          GET /health
  data/
    booksData.ts                hard-coded array
  types/
    book.ts                     the Book type
```

### Request flow

```
HTTP request
   |
   v
books.routes.ts      which URL is this?
   |
   v
books.controller.ts  read req, choose a status code, send JSON
   |
   v
books.service.ts     find the data
   |
   v
data/booksData.ts    the array
```

Each layer has one job:

| Layer | Does | Does **not** |
| --- | --- | --- |
| route | map URL to a handler | contain logic |
| controller | read `req`, write `res` | touch the data array |
| service | find/filter data | touch `req` or `res` |

Rules of thumb: if a handler touches the data array, logic leaked into the controller. If a service imports `Request`, the layers are wired backwards.

### Why `app.ts` and `server.ts` are separate

`app.ts` builds the app. `server.ts` starts it.

`app.ts` never calls `listen()`, so it can be imported by a test without binding a port.

---

## Module exports

Both styles are used on purpose:

| Export | File | Why this style |
| --- | --- | --- |
| `export default app` | `app.ts` | the app is the one main thing this module provides |
| `export default router` | `books.routes.ts` | one router per module |
| `export const getAll`, `getById` | `books.controller.ts` | several handlers, imported by name |
| `export const getAllBooks`, `getBookById` | `books.service.ts` | several functions, imported by name |
| `export const books` + `export default books` | `booksData.ts` | same data, both ways |

**Default** = "the" thing. **Named** = one of several things.

`server.ts` consumes the default export:

```ts
import app from './app.ts';
```

---

## TypeScript notes

**1. Relative imports use `.ts`, not `.js`**

```ts
import app from './app.ts';
```

Node runs TypeScript directly, so the real file name is what it needs. When you run `pnpm build`, the `rewriteRelativeImportExtensions` option rewrites `.ts` to `.js` for `dist/`.

**2. Type-only imports need `import type`**

```ts
import type { Book } from '../types/book.ts';
```

`verbatimModuleSyntax` is on, so the compiler demands this. It also means types are fully erased at runtime.

**3. Use `.find()`, not indexing**

`noUncheckedIndexedAccess` makes `books[0]` typed as `Book | undefined`, because index 0 might not exist. `.find()` returns `Book | undefined` honestly — which is where the 404 comes from.

---

## Environment

Copy the example file:

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Port to listen on |
| `NODE_ENV` | `development` | Runtime environment |

`.env` is gitignored. Node loads it with `--env-file-if-exists`, so no `dotenv` dependency is needed.

`process.env.PORT` is a **string**, so it is converted:

```ts
const PORT = Number(process.env.PORT) || 3000;
```

---

## Troubleshooting

### The server stops and prints:

```
server is running on port: 3000
Completed running 'src/server.ts'. Waiting for file changes before restarting...
```

Something is **already using port 3000** — usually an earlier `pnpm dev` left running after its terminal was closed.

Find it:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess
```

Kill every stray instance:

```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'server\.ts' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

Then start one `pnpm dev`.

### The browser shows a red ✗ and "Provisional headers are shown"

Chrome never reached the server. Check that `pnpm dev` is running and print the URL again:

```bash
curl.exe -i http://localhost:3000/health
```

On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use **`curl.exe`** to get real curl.

### Editing a file does not restart the server

Only files Node actually loads are watched. `types/book.ts` holds only types, so it is erased before running and never watched. That is expected.

---

## Git

```bash
git add .
git status     # node_modules and .env must NOT appear
git commit -m "feat: ..."
git push
```
