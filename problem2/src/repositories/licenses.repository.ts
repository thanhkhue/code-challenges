import { eq, and, sql, count, asc, desc, getTableColumns, isNull, SQL } from 'drizzle-orm';
import { db } from '../db/database';
import { licenses, games, operators } from '../db/schema';
import { LicenseWithRelations, CreateLicenseDTO, UpdateLicenseDTO, LicenseFilters, Pagination } from '../types';

const SORT_COLUMNS = {
  start_date:        licenses.start_date,
  expiry_date:       licenses.expiry_date,
  revenue_share_pct: licenses.revenue_share_pct,
  created_at:        licenses.created_at,
} as const;

function orderBy(sort?: string) {
  if (!sort) return desc(licenses.created_at);
  const [field, dir] = sort.split(':');
  const col = SORT_COLUMNS[field as keyof typeof SORT_COLUMNS];
  if (!col) return desc(licenses.created_at);
  return dir === 'desc' ? desc(col) : asc(col);
}

const withRelations = {
  ...getTableColumns(licenses),
  game_name:     games.name,
  game_provider: games.provider,
  operator_name: operators.name,
};

function baseQuery() {
  return db.select(withRelations)
    .from(licenses)
    .innerJoin(games,     eq(licenses.game_id,     games.id))
    .innerJoin(operators, eq(licenses.operator_id, operators.id));
}

export function findById(id: string): LicenseWithRelations | undefined {
  return baseQuery().where(and(eq(licenses.id, id), isNull(licenses.deleted_at))).get() as LicenseWithRelations | undefined;
}

export function findAll(filters: LicenseFilters, pagination: Pagination): { rows: LicenseWithRelations[]; total: number } {
  const conditions: SQL[] = [
    filters.game_id     ? eq(licenses.game_id,     filters.game_id)     : undefined,
    filters.operator_id ? eq(licenses.operator_id, filters.operator_id) : undefined,
    filters.type        ? eq(licenses.type,        filters.type)        : undefined,
    filters.status      ? eq(licenses.status,      filters.status)      : undefined,
    isNull(licenses.deleted_at),
  ].filter((c): c is SQL => c !== undefined);

  const where = and(...conditions);
  const offset = (pagination.page - 1) * pagination.limit;

  const [{ total }] = db.select({ total: count() }).from(licenses).where(where).all();
  const rows = baseQuery().where(where)
    .orderBy(orderBy(filters.sort))
    .limit(pagination.limit)
    .offset(offset)
    .all() as LicenseWithRelations[];

  return { rows, total };
}

export function create(dto: CreateLicenseDTO): LicenseWithRelations {
  const { id } = db.insert(licenses).values(dto).returning({ id: licenses.id }).get()!;
  return findById(id)!;
}

export function update(id: string, dto: UpdateLicenseDTO): LicenseWithRelations {
  db.update(licenses)
    .set({ ...dto, updated_at: sql`(datetime('now'))` })
    .where(eq(licenses.id, id))
    .run();
  return findById(id)!;
}

export function remove(id: string): void {
  db.update(licenses).set({ deleted_at: sql`(datetime('now'))` }).where(eq(licenses.id, id)).run();
}
