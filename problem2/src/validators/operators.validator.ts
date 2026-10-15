import { z } from 'zod';

const tier   = z.enum(['starter', 'standard', 'enterprise']);
const status = z.enum(['active', 'suspended', 'inactive']);

export const createOperatorSchema = z.object({
  name:          z.string().min(1, 'name is required').trim(),
  jurisdiction:  z.string().min(1, 'jurisdiction is required').trim(),
  tier:          tier.default('standard'),
  status:        status.default('active'),
  contact_email: z.string().email('contact_email must be a valid email address').nullable().optional(),
});

export const updateOperatorSchema = createOperatorSchema.partial();

export const listOperatorsSchema = z.object({
  name:         z.string().optional(),
  jurisdiction: z.string().optional(),
  tier:         z.string().optional(),
  status:       z.string().optional(),
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(100).default(20),
});
