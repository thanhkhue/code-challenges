# Game License Marketplace API

A RESTful CRUD backend for a B2B game license marketplace — where game studios license their titles to platform operators. Built with **Express**, **TypeScript**, **SQLite** (via `better-sqlite3`), and **Drizzle ORM**.

## Domain

| Entity | Description |
|---|---|
| **Game** | A game title (slots, table, live, etc.) published by a studio |
| **Operator** | A platform operator who licenses games to run on their platform |
| **License** | A contract granting an operator the right to use a specific game |

## Prerequisites

- Node.js >= 20.12
- npm >= 9

## Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the values.

### 3. Run the server

Migrations run automatically on startup.

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

The server starts on **http://localhost:3000** by default.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DB_PATH` | `./data.db` | Path to SQLite database file |
| `API_KEY` | *(unset)* | If set, all `/api/*` routes require this key via `x-api-key` header. If unset, auth is skipped |

## Authentication

All `/api/*` routes require an `x-api-key` header when `API_KEY` is set.

```bash
curl http://localhost:3000/api/games \
  -H "x-api-key: your-secret-key"
```

Missing or wrong key returns `401`:

```json
{ "error": "Invalid or missing API key" }
```

The `/health` endpoint is always public.

## Running tests

```bash
npm run test:run        # run once
npm run test:coverage   # with coverage report
```

## Database migrations

Migrations live in the `drizzle/` folder. They run automatically on every server startup.

To generate a new migration after editing `src/db/schema.ts`:

```bash
npm run db:generate
```

## API Reference

All responses use a consistent envelope:

```json
{ "data": { ... } }
```

List endpoints include pagination:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

### Games

#### Create a game

```
POST /api/games
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Game title |
| `provider` | string | Yes | Studio / publisher name |
| `genre` | string | No | `slots` `table` `live` `scratch` `virtual_sports` (default: `slots`) |
| `platform` | string | No | `desktop` `mobile` `both` (default: `both`) |
| `rtp` | number | No | Return to player %, 0–100 |
| `volatility` | string | No | `low` `medium` `high` |
| `description` | string | No | |
| `status` | string | No | `active` `inactive` `deprecated` (default: `active`) |

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{"name":"Book of Ra","provider":"Novomatic","genre":"slots","rtp":95.1,"volatility":"high"}'
```

#### List games

```
GET /api/games
```

| Param | Description |
|---|---|
| `name` | Partial name search |
| `provider` | Exact match |
| `genre` | Exact match |
| `platform` | Exact match |
| `status` | Exact match |
| `volatility` | Exact match |
| `min_rtp` | RTP >= value |
| `max_rtp` | RTP <= value |
| `page` | Default: 1 |
| `limit` | Max 100, default: 20 |

```bash
curl "http://localhost:3000/api/games?genre=slots&volatility=high&min_rtp=95"
```

#### Get a game

```
GET /api/games/:id
```

#### Update a game

```
PUT /api/games/:id
```

Accepts any subset of the create fields.

```bash
curl -X PUT http://localhost:3000/api/games/<uuid> \
  -H "Content-Type: application/json" \
  -d '{"status":"deprecated"}'
```

#### Delete a game

```
DELETE /api/games/:id
```

Returns `204`. Soft-deletes the record. Returns `409` if the game has existing licenses.

---

### Operators

#### Create an operator

```
POST /api/operators
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Operator / brand name |
| `jurisdiction` | string | Yes | Licensing authority (e.g. `MGA`, `UKGC`, `Curacao`) |
| `tier` | string | No | `starter` `standard` `enterprise` (default: `standard`) |
| `contact_email` | string | No | |
| `status` | string | No | `active` `suspended` `inactive` (default: `active`) |

#### List operators

```
GET /api/operators
```

Query params: `name`, `jurisdiction`, `tier`, `status`, `page`, `limit`

#### Get an operator

```
GET /api/operators/:id
```

#### Update an operator

```
PUT /api/operators/:id
```

#### Delete an operator

```
DELETE /api/operators/:id
```

Returns `204`. Soft-deletes the record. Returns `409` if the operator has existing licenses.

---

### Licenses

#### Create a license

```
POST /api/licenses
```

| Field | Type | Required | Description |
|---|---|---|---|
| `game_id` | string (UUID) | Yes | |
| `operator_id` | string (UUID) | Yes | |
| `type` | string | No | `perpetual` `subscription` (default: `subscription`) |
| `revenue_share_pct` | number | No | 0–100, default: `0` |
| `start_date` | string | Yes | ISO 8601 date |
| `expiry_date` | string | No | ISO 8601 date, must be after `start_date` |
| `status` | string | No | `pending` `active` `suspended` `expired` (default: `pending`) |

Game must be `active`, operator must be `active`, and a game–operator pair can only have one license.

```bash
curl -X POST http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "<game-uuid>",
    "operator_id": "<operator-uuid>",
    "type": "subscription",
    "revenue_share_pct": 15,
    "start_date": "2024-01-01",
    "expiry_date": "2025-01-01"
  }'
```

#### List licenses

```
GET /api/licenses
```

Query params: `game_id`, `operator_id`, `type`, `status`, `page`, `limit`

Responses include `game_name`, `game_provider`, and `operator_name`.

```bash
curl "http://localhost:3000/api/licenses?operator_id=<uuid>&status=active"
```

#### Get a license

```
GET /api/licenses/:id
```

#### Update a license

```
PUT /api/licenses/:id
```

Accepts: `type`, `revenue_share_pct`, `start_date`, `expiry_date`, `status`.

#### Delete a license

```
DELETE /api/licenses/:id
```

Returns `204`. Soft-deletes the record.

---

## Error responses

| Status | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid API key |
| `404` | Not found |
| `409` | Conflict |
| `500` | Internal server error |

## Project structure

```
src/
  index.ts                  # Entry point
  app.ts                    # Express setup (routes, middleware)
  db/
    database.ts             # SQLite connection + auto-migration
    schema.ts               # Drizzle schema
  middleware/
    errorHandler.ts
    apiKey.ts
  routes/
  controllers/              # Request parsing + Zod validation
  services/                 # Business logic
  repositories/             # Drizzle queries
  validators/               # Zod schemas
  types/
drizzle/                    # SQL migration files
```
