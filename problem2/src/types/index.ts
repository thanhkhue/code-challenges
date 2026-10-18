import { InferSelectModel } from 'drizzle-orm';
import * as schema from '../db/schema';

// ─── Entities (derived from Drizzle schema — always in sync) ─────────────────

export type Game     = InferSelectModel<typeof schema.games>;
export type Operator = InferSelectModel<typeof schema.operators>;
export type License  = InferSelectModel<typeof schema.licenses>;

export interface LicenseWithRelations extends License {
  game_name: string;
  game_provider: string;
  operator_name: string;
}

// ─── Literal unions (re-exported for controllers) ────────────────────────────

export type GameGenre      = 'slots' | 'table' | 'live' | 'scratch' | 'virtual_sports';
export type GamePlatform   = 'desktop' | 'mobile' | 'both';
export type GameStatus     = 'active' | 'inactive' | 'deprecated';
export type GameVolatility = 'low' | 'medium' | 'high';

export type OperatorTier   = 'starter' | 'standard' | 'enterprise';
export type OperatorStatus = 'active' | 'suspended' | 'inactive';

export type LicenseType   = 'perpetual' | 'subscription';
export type LicenseStatus = 'pending' | 'active' | 'suspended' | 'expired';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateGameDTO {
  name: string;
  provider: string;
  genre: GameGenre;
  platform: GamePlatform;
  rtp?: number | null;
  volatility?: GameVolatility | null;
  description?: string | null;
  status: GameStatus;
}

export interface UpdateGameDTO {
  name?: string;
  provider?: string;
  genre?: GameGenre;
  platform?: GamePlatform;
  rtp?: number | null;
  volatility?: GameVolatility | null;
  description?: string | null;
  status?: GameStatus;
}

export interface GameFilters {
  name?: string;
  provider?: string;
  genre?: string;
  platform?: string;
  status?: string;
  volatility?: string;
  min_rtp?: number;
  max_rtp?: number;
  sort?: string;
}

export interface CreateOperatorDTO {
  name: string;
  jurisdiction: string;
  tier: OperatorTier;
  contact_email?: string | null;
  status: OperatorStatus;
}

export interface UpdateOperatorDTO {
  name?: string;
  jurisdiction?: string;
  tier?: OperatorTier;
  contact_email?: string | null;
  status?: OperatorStatus;
}

export interface OperatorFilters {
  name?: string;
  jurisdiction?: string;
  tier?: string;
  status?: string;
  sort?: string;
}

export interface CreateLicenseDTO {
  game_id: string;
  operator_id: string;
  type: LicenseType;
  revenue_share_pct: number;
  start_date: string;
  expiry_date?: string | null;
  status: LicenseStatus;
}

export interface UpdateLicenseDTO {
  type?: LicenseType;
  revenue_share_pct?: number;
  start_date?: string;
  expiry_date?: string | null;
  status?: LicenseStatus;
}

export interface LicenseFilters {
  game_id?: string;
  operator_id?: string;
  type?: string;
  status?: string;
  sort?: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
