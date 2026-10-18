import { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import * as LicensesService from '../services/licenses.service';
import { createLicenseSchema, updateLicenseSchema, listLicensesSchema } from '../validators/licenses.validator';

type CreateBody = z.input<typeof createLicenseSchema>;
type UpdateBody = z.input<typeof updateLicenseSchema>;
type IdParams   = { id: string };
type ListQuery  = z.input<typeof listLicensesSchema>;

export function create(req: Request<{}, {}, CreateBody>, res: Response, next: NextFunction): void {
  try {
    const dto = createLicenseSchema.parse(req.body);
    res.status(201).json({ data: LicensesService.createLicense(dto) });
  } catch (err) { next(err); }
}

export function list(req: Request<{}, {}, {}, ListQuery>, res: Response, next: NextFunction): void {
  try {
    const { page, limit, ...filters } = listLicensesSchema.parse(req.query);
    res.json(LicensesService.listLicenses(filters, { page, limit }));
  } catch (err) { next(err); }
}

export function getById(req: Request<IdParams>, res: Response, next: NextFunction): void {
  try {
    res.json({ data: LicensesService.getLicense(req.params.id) });
  } catch (err) { next(err); }
}

export function update(req: Request<IdParams, {}, UpdateBody>, res: Response, next: NextFunction): void {
  try {
    const dto = updateLicenseSchema.parse(req.body);
    res.json({ data: LicensesService.updateLicense(req.params.id, dto) });
  } catch (err) { next(err); }
}

export function remove(req: Request<IdParams>, res: Response, next: NextFunction): void {
  try {
    LicensesService.deleteLicense(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
