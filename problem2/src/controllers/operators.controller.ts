import { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import * as OperatorsService from '../services/operators.service';
import { createOperatorSchema, updateOperatorSchema, listOperatorsSchema } from '../validators/operators.validator';

type CreateBody = z.input<typeof createOperatorSchema>;
type UpdateBody = z.input<typeof updateOperatorSchema>;
type IdParams   = { id: string };
type ListQuery  = z.input<typeof listOperatorsSchema>;

export function create(req: Request<{}, {}, CreateBody>, res: Response, next: NextFunction): void {
  try {
    const dto = createOperatorSchema.parse(req.body);
    res.status(201).json({ data: OperatorsService.createOperator(dto) });
  } catch (err) { next(err); }
}

export function list(req: Request<{}, {}, {}, ListQuery>, res: Response, next: NextFunction): void {
  try {
    const { page, limit, ...filters } = listOperatorsSchema.parse(req.query);
    res.json(OperatorsService.listOperators(filters, { page, limit }));
  } catch (err) { next(err); }
}

export function getById(req: Request<IdParams>, res: Response, next: NextFunction): void {
  try {
    res.json({ data: OperatorsService.getOperator(req.params.id) });
  } catch (err) { next(err); }
}

export function update(req: Request<IdParams, {}, UpdateBody>, res: Response, next: NextFunction): void {
  try {
    const dto = updateOperatorSchema.parse(req.body);
    res.json({ data: OperatorsService.updateOperator(req.params.id, dto) });
  } catch (err) { next(err); }
}

export function remove(req: Request<IdParams>, res: Response, next: NextFunction): void {
  try {
    OperatorsService.deleteOperator(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
