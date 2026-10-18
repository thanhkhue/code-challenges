import { z } from 'zod';

const genre      = z.enum(['slots', 'table', 'live', 'scratch', 'virtual_sports']);
const platform   = z.enum(['desktop', 'mobile', 'both']);
const status     = z.enum(['active', 'inactive', 'deprecated']);
const volatility = z.enum(['low', 'medium', 'high']);
const rtp        = z.number().min(0).max(100).nullable().optional();

export const createGameSchema = z.object({
  name:        z.string().min(1, 'name is required').trim(),
  provider:    z.string().min(1, 'provider is required').trim(),
  genre:       genre.default('slots'),
  platform:    platform.default('both'),
  status:      status.default('active'),
  rtp,
  volatility:  volatility.nullable().optional(),
  description: z.string().nullable().optional(),
});

export const updateGameSchema = createGameSchema.partial();

export const listGamesSchema = z.object({
  name:       z.string().optional(),
  provider:   z.string().optional(),
  genre:      z.string().optional(),
  platform:   z.string().optional(),
  status:     z.string().optional(),
  volatility: z.string().optional(),
  min_rtp:    z.coerce.number().min(0).max(100).optional(),
  max_rtp:    z.coerce.number().min(0).max(100).optional(),
  page:       z.coerce.number().int().positive().default(1),
  limit:      z.coerce.number().int().positive().max(100).default(20),
  sort:       z.string().regex(/^\w+:(asc|desc)$/, 'sort must be field:asc or field:desc').optional(),
});
