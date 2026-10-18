import { z } from 'zod';

const isoDate = z.string().refine(v => !isNaN(Date.parse(v)), 'must be a valid ISO 8601 date');
const type    = z.enum(['perpetual', 'subscription']);
const status  = z.enum(['pending', 'active', 'suspended', 'expired']);

export const createLicenseSchema = z.object({
  game_id:           z.string().min(1, 'game_id is required'),
  operator_id:       z.string().min(1, 'operator_id is required'),
  type:              type.default('subscription'),
  status:            status.default('pending'),
  revenue_share_pct: z.number().min(0).max(100).default(0),
  start_date:        isoDate,
  expiry_date:       isoDate.nullable().optional(),
}).refine(
  data => !data.expiry_date || new Date(data.expiry_date) > new Date(data.start_date),
  { message: 'expiry_date must be after start_date', path: ['expiry_date'] },
);

export const updateLicenseSchema = z.object({
  type:              type.optional(),
  status:            status.optional(),
  revenue_share_pct: z.number().min(0).max(100).optional(),
  start_date:        isoDate.optional(),
  expiry_date:       isoDate.nullable().optional(),
});

export const listLicensesSchema = z.object({
  game_id:     z.string().optional(),
  operator_id: z.string().optional(),
  type:        z.string().optional(),
  status:      z.string().optional(),
  page:        z.coerce.number().int().positive().default(1),
  limit:       z.coerce.number().int().positive().max(100).default(20),
  sort:        z.string().regex(/^\w+:(asc|desc)$/, 'sort must be field:asc or field:desc').optional(),
});
