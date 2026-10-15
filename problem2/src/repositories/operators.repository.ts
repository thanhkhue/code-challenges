import { eq, like, and, sql, count, desc, isNull, SQL } from 'drizzle-orm';
import { db } from '../db/database';
import { operators, licenses } from '../db/schema';
import { Operator, CreateOperatorDTO, UpdateOperatorDTO, OperatorFilters, Pagination } from '../types';

export function findById(id: string): Operator | undefined {
  return db.select().from(operators).where(and(eq(operators.id, id), isNull(operators.deleted_at))).get() as Operator | undefined;
}

export function findAll(filters: OperatorFilters, pagination: Pagination): { rows: Operator[]; total: number } {
  const conditions: SQL[] = [
    filters.name         ? like(operators.name, `%${filters.name}%`)         : undefined,
    filters.jurisdiction ? eq(operators.jurisdiction, filters.jurisdiction)   : undefined,
    filters.tier         ? eq(operators.tier, filters.tier)                   : undefined,
    filters.status       ? eq(operators.status, filters.status)               : undefined,
    isNull(operators.deleted_at),
  ].filter((c): c is SQL => c !== undefined);

  const where = and(...conditions);
  const offset = (pagination.page - 1) * pagination.limit;

  const [{ total }] = db.select({ total: count() }).from(operators).where(where).all();
  const rows = db.select().from(operators).where(where)
    .orderBy(desc(operators.created_at))
    .limit(pagination.limit)
    .offset(offset)
    .all() as Operator[];

  return { rows, total };
}

export function create(dto: CreateOperatorDTO): Operator {
  return db.insert(operators).values(dto).returning().get() as Operator;
}

export function update(id: string, dto: UpdateOperatorDTO): Operator {
  return db.update(operators)
    .set({ ...dto, updated_at: sql`(datetime('now'))` })
    .where(eq(operators.id, id))
    .returning()
    .get() as Operator;
}

export function remove(id: string): void {
  db.update(operators).set({ deleted_at: sql`(datetime('now'))` }).where(eq(operators.id, id)).run();
}

export function countLicenses(operatorId: string): number {
  const [{ total }] = db.select({ total: count() }).from(licenses)
    .where(and(eq(licenses.operator_id, operatorId), isNull(licenses.deleted_at))).all();
  return total;
}
