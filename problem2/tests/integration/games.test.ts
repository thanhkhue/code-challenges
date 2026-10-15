import { describe, it, expect, vi, beforeEach } from 'vitest';
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

const app = createApp();
const KEY = 'test-key';
const auth = { 'x-api-key': KEY };

const validGame = { name: 'Book of Ra', provider: 'Novomatic', genre: 'slots', rtp: 95.1, volatility: 'high' };

describe('POST /api/games', () => {
  it('creates a game and returns 201', async () => {
    const res = await request(app).post('/api/games').set(auth).send(validGame);
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ name: 'Book of Ra', provider: 'Novomatic' });
    expect(res.body.data.id).toBeDefined();
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/games').set(auth).send({ provider: 'Novomatic' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for invalid genre', async () => {
    const res = await request(app).post('/api/games').set(auth).send({ ...validGame, genre: 'invalid' });
    expect(res.status).toBe(400);
  });

  it('returns 401 without API key', async () => {
    const res = await request(app).post('/api/games').send(validGame);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/games', () => {
  it('returns paginated list', async () => {
    const res = await request(app).get('/api/games').set(auth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
  });

  it('filters by genre', async () => {
    const res = await request(app).get('/api/games?genre=slots').set(auth);
    expect(res.status).toBe(200);
    res.body.data.forEach((g: { genre: string }) => expect(g.genre).toBe('slots'));
  });
});

describe('GET /api/games/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/games/nonexistent-id').set(auth);
    expect(res.status).toBe(404);
  });

  it('returns game by id', async () => {
    const created = await request(app).post('/api/games').set(auth).send(validGame);
    const res = await request(app).get(`/api/games/${created.body.data.id}`).set(auth);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(created.body.data.id);
  });
});

describe('PUT /api/games/:id', () => {
  it('updates a game', async () => {
    const created = await request(app).post('/api/games').set(auth).send(validGame);
    const res = await request(app).put(`/api/games/${created.body.data.id}`).set(auth).send({ status: 'inactive' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('inactive');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/games/nonexistent').set(auth).send({ name: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/games/:id', () => {
  it('soft-deletes a game and returns 204', async () => {
    const created = await request(app).post('/api/games').set(auth).send(validGame);
    const del = await request(app).delete(`/api/games/${created.body.data.id}`).set(auth);
    expect(del.status).toBe(204);
  });

  it('returns 404 after deletion', async () => {
    const created = await request(app).post('/api/games').set(auth).send(validGame);
    await request(app).delete(`/api/games/${created.body.data.id}`).set(auth);
    const res = await request(app).get(`/api/games/${created.body.data.id}`).set(auth);
    expect(res.status).toBe(404);
  });
});
