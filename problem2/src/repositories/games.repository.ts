import { eq, like, and, gte, lte, sql, count, asc, desc, isNull, SQL } from 'drizzle-orm';
import { db } from '../db/database';
import { games, licenses } from '../db/schema';
import { Game, CreateGameDTO, UpdateGameDTO, GameFilters, Pagination } from '../types';

const SORT_COLUMNS = {
  name:       games.name,
  rtp:        games.rtp,
  created_at: games.created_at,
  updated_at: games.updated_at,
} as const;

function orderBy(sort?: string) {
  if (!sort) return desc(games.created_at);
  const [field, dir] = sort.split(':');
  const col = SORT_COLUMNS[field as keyof typeof SORT_COLUMNS];
  if (!col) return desc(games.created_at);
  return dir === 'desc' ? desc(col) : asc(col);
}

export function findById(id: string): Game | undefined {
  return db.select().from(games).where(and(eq(games.id, id), isNull(games.deleted_at))).get() as Game | undefined;
}

export function findAll(filters: GameFilters, pagination: Pagination): { rows: Game[]; total: number } {
  const conditions: SQL[] = [
    filters.name       ? like(games.name, `%${filters.name}%`)   : undefined,
    filters.provider   ? eq(games.provider, filters.provider)     : undefined,
    filters.genre      ? eq(games.genre, filters.genre)           : undefined,
    filters.platform   ? eq(games.platform, filters.platform)     : undefined,
    filters.status     ? eq(games.status, filters.status)         : undefined,
    filters.volatility ? eq(games.volatility, filters.volatility) : undefined,
    filters.min_rtp !== undefined ? gte(games.rtp, filters.min_rtp) : undefined,
    filters.max_rtp !== undefined ? lte(games.rtp, filters.max_rtp) : undefined,
    isNull(games.deleted_at),
  ].filter((c): c is SQL => c !== undefined);

  const where = and(...conditions);
  const offset = (pagination.page - 1) * pagination.limit;

  const [{ total }] = db.select({ total: count() }).from(games).where(where).all();
  const rows = db.select().from(games).where(where)
    .orderBy(orderBy(filters.sort))
    .limit(pagination.limit)
    .offset(offset)
    .all() as Game[];

  return { rows, total };
}

export function create(dto: CreateGameDTO): Game {
  return db.insert(games).values(dto).returning().get() as Game;
}

export function update(id: string, dto: UpdateGameDTO): Game {
  return db.update(games)
    .set({ ...dto, updated_at: sql`(datetime('now'))` })
    .where(eq(games.id, id))
    .returning()
    .get() as Game;
}

export function remove(id: string): void {
  db.update(games).set({ deleted_at: sql`(datetime('now'))` }).where(eq(games.id, id)).run();
}

export function countLicenses(gameId: string): number {
  const [{ total }] = db.select({ total: count() }).from(licenses)
    .where(and(eq(licenses.game_id, gameId), isNull(licenses.deleted_at))).all();
  return total;
}
