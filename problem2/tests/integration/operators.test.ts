import { describe, it, expect, vi } from 'vitest';
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
const validOperator = { name: 'LuckyCasino', jurisdiction: 'MGA', tier: 'enterprise' };

describe('POST /api/operators', () => {
  it('creates an operator and returns 201', async () => {
    const res = await request(app).post('/api/operators').set(auth).send(validOperator);
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ name: 'LuckyCasino', jurisdiction: 'MGA' });
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app).post('/api/operators').set(auth)
      .send({ ...validOperator, contact_email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid tier', async () => {
    const res = await request(app).post('/api/operators').set(auth)
      .send({ ...validOperator, tier: 'premium' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/operators', () => {
  it('returns paginated list', async () => {
    const res = await request(app).get('/api/operators').set(auth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pagination');
  });
});

describe('DELETE /api/operators/:id', () => {
  it('soft-deletes and returns 204', async () => {
    const created = await request(app).post('/api/operators').set(auth).send(validOperator);
    const res = await request(app).delete(`/api/operators/${created.body.data.id}`).set(auth);
    expect(res.status).toBe(204);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/operators/nonexistent').set(auth);
    expect(res.status).toBe(404);
  });
});
