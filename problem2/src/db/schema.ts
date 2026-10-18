import { sqliteTable, text, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const games = sqliteTable('games', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:        text('name').notNull(),
  provider:    text('provider').notNull(),
  genre:       text('genre').notNull().default('slots'),
  platform:    text('platform').notNull().default('both'),
  rtp:         real('rtp'),
  volatility:  text('volatility'),
  description: text('description'),
  status:      text('status').notNull().default('active'),
  created_at:  text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at:  text('updated_at').notNull().default(sql`(datetime('now'))`),
  deleted_at:  text('deleted_at'),
}, (t) => [
  index('idx_games_provider').on(t.provider),
  index('idx_games_genre').on(t.genre),
  index('idx_games_status').on(t.status),
  index('idx_games_rtp').on(t.rtp),
]);

export const operators = sqliteTable('operators', {
  id:            text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text('name').notNull(),
  jurisdiction:  text('jurisdiction').notNull(),
  tier:          text('tier').notNull().default('standard'),
  contact_email: text('contact_email'),
  status:        text('status').notNull().default('active'),
  created_at:    text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at:    text('updated_at').notNull().default(sql`(datetime('now'))`),
  deleted_at:    text('deleted_at'),
}, (t) => [
  index('idx_operators_jurisdiction').on(t.jurisdiction),
  index('idx_operators_status').on(t.status),
]);

export const licenses = sqliteTable('licenses', {
  id:                text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  game_id:           text('game_id').notNull().references(() => games.id),
  operator_id:       text('operator_id').notNull().references(() => operators.id),
  type:              text('type').notNull().default('subscription'),
  revenue_share_pct: real('revenue_share_pct').notNull().default(0),
  start_date:        text('start_date').notNull(),
  expiry_date:       text('expiry_date'),
  status:            text('status').notNull().default('pending'),
  created_at:        text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at:        text('updated_at').notNull().default(sql`(datetime('now'))`),
  deleted_at:        text('deleted_at'),
}, (t) => [
  uniqueIndex('licenses_game_operator_unique').on(t.game_id, t.operator_id),
  index('idx_licenses_game_id').on(t.game_id),
  index('idx_licenses_operator_id').on(t.operator_id),
  index('idx_licenses_status').on(t.status),
  index('idx_licenses_start_date').on(t.start_date),
]);
