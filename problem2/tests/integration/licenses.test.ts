import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

vi.mock('../../src/db/database', async () => {
  const Database = (await import('better-sqlite3')).default;
  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator');
  const schema = await import('../../src/db/schema');
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: './drizzle' });
  return { db };
});

import { createApp } from '../../src/app';

const app  = createApp();
const auth = { 'x-api-key': 'test-key' };

let gameId: string;
let operatorId: string;

beforeAll(async () => {
  const g = await request(app).post('/api/games').set(auth)
    .send({ name: 'Book of Ra', provider: 'Novomatic', genre: 'slots' });
  gameId = g.body.data.id;

  const o = await request(app).post('/api/operators').set(auth)
    .send({ name: 'LuckyCasino', jurisdiction: 'MGA' });
  operatorId = o.body.data.id;
});

describe('POST /api/licenses', () => {
  it('creates a license and returns 201', async () => {
    const res = await request(app).post('/api/licenses').set(auth).send({
      game_id: gameId, operator_id: operatorId,
      type: 'subscription', revenue_share_pct: 15,
      start_date: '2024-01-01', status: 'active',
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ game_name: 'Book of Ra', operator_name: 'LuckyCasino' });
  });

  it('returns 400 when start_date is missing', async () => {
    const res = await request(app).post('/api/licenses').set(auth)
      .send({ game_id: gameId, operator_id: operatorId });
    expect(res.status).toBe(400);
  });

  it('returns 400 when expiry_date is before start_date', async () => {
    const res = await request(app).post('/api/licenses').set(auth).send({
      game_id: gameId, operator_id: operatorId,
      start_date: '2025-01-01', expiry_date: '2024-01-01',
    });
    expect(res.status).toBe(400);
  });

  it('returns 409 when license already exists for same game+operator', async () => {
    const res = await request(app).post('/api/licenses').set(auth).send({
      game_id: gameId, operator_id: operatorId,
      start_date: '2024-06-01', status: 'pending',
    });
    expect(res.status).toBe(409);
  });

  it('returns 404 for non-existent game', async () => {
    const res = await request(app).post('/api/licenses').set(auth).send({
      game_id: 'nonexistent', operator_id: operatorId,
      start_date: '2024-01-01',
    });
    expect(res.status).toBe(404);
  });
});

describe('GET /api/licenses', () => {
  it('returns paginated list with relation fields', async () => {
    const res = await request(app).get('/api/licenses').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('game_name');
    expect(res.body.data[0]).toHaveProperty('operator_name');
  });
});
