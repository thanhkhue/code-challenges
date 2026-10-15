import { Request, Response, NextFunction } from 'express';
import * as OperatorsService from '../services/operators.service';
import { createOperatorSchema, updateOperatorSchema, listOperatorsSchema } from '../validators/operators.validator';

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const dto = createOperatorSchema.parse(req.body);
    res.status(201).json({ data: OperatorsService.createOperator(dto) });
  } catch (err) { next(err); }
}

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const { page, limit, ...filters } = listOperatorsSchema.parse(req.query);
    res.json(OperatorsService.listOperators(filters, { page, limit }));
  } catch (err) { next(err); }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    res.json({ data: OperatorsService.getOperator(req.params.id) });
  } catch (err) { next(err); }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const dto = updateOperatorSchema.parse(req.body);
    res.json({ data: OperatorsService.updateOperator(req.params.id, dto) });
  } catch (err) { next(err); }
}

export function remove(req: Request, res: Response, next: NextFunction): void {
  try {
    OperatorsService.deleteOperator(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
