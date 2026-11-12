# myBackend

A minimal Express + TypeScript API that serves a JSON health endpoint.

## Requirements

- Node.js 24+
- pnpm

## Setup

```bash
pnpm install
```

## Run (development)

```bash
pnpm dev
```

Starts the server with hot reload on `http://localhost:3000`.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Run `src/server.ts` with `node --watch` and load `.env` |
| `pnpm typecheck` | Type-check without emitting files |
| `pnpm build` | Compile `src/` to `dist/` |
| `pnpm start` | Run the compiled build (`dist/server.js`) |

## Endpoint

### `GET /health`

Request:

```bash
curl -i http://localhost:3000/health
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 84

{"status":"ok","message":"Server is healthy","timestamp":"2026-11-12T06:08:29.719Z"}
```

## Project structure

```
src/
  app.ts      Express app: middleware and routes (no listen)
  server.ts   Entry point: reads PORT and starts listening
```

## Module exports

Both export styles are used deliberately:

| Export | Location | Why |
| --- | --- | --- |
| `export default app` | `src/app.ts` | The app is the single main thing this module provides |
| `export const health` | `src/app.ts` | Named, so the handler can be imported by name and renamed/refactored safely |

`src/server.ts` consumes the default export:

```ts
import app from "./app.ts";
```

> Note: relative imports use the `.ts` extension because Node runs TypeScript
> directly in development. The `rewriteRelativeImportExtensions` compiler
> option rewrites them to `.js` in the `dist/` build.

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Port the server listens on |
| `NODE_ENV` | `development` | Runtime environment |

`.env` is gitignored. Node loads it natively via `--env-file-if-exists`, so no
`dotenv` dependency is needed.
