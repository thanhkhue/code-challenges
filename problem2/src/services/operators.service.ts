import * as OperatorsRepo from '../repositories/operators.repository';
import { AppError } from '../middleware/errorHandler';
import { Operator, CreateOperatorDTO, UpdateOperatorDTO, OperatorFilters, Pagination, PaginatedResult } from '../types';

export function createOperator(dto: CreateOperatorDTO): Operator {
  return OperatorsRepo.create(dto);
}

export function listOperators(filters: OperatorFilters, pagination: Pagination): PaginatedResult<Operator> {
  const { rows, total } = OperatorsRepo.findAll(filters, pagination);
  return {
    data: rows,
    pagination: { page: pagination.page, limit: pagination.limit, total, total_pages: Math.ceil(total / pagination.limit) },
  };
}

export function getOperator(id: string): Operator {
  const operator = OperatorsRepo.findById(id);
  if (!operator) throw new AppError(404, 'Operator not found');
  return operator;
}

export function updateOperator(id: string, dto: UpdateOperatorDTO): Operator {
  if (!OperatorsRepo.findById(id)) throw new AppError(404, 'Operator not found');
  return OperatorsRepo.update(id, dto);
}

export function deleteOperator(id: string): void {
  if (!OperatorsRepo.findById(id)) throw new AppError(404, 'Operator not found');

  const licenseCount = OperatorsRepo.countLicenses(id);
  if (licenseCount > 0)
    throw new AppError(409, `Cannot delete operator with ${licenseCount} license(s). Remove licenses first.`);

  OperatorsRepo.remove(id);
}
