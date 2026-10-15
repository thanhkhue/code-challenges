import * as LicensesRepo from '../repositories/licenses.repository';
import * as GamesRepo from '../repositories/games.repository';
import * as OperatorsRepo from '../repositories/operators.repository';
import { AppError } from '../middleware/errorHandler';
import { LicenseWithRelations, CreateLicenseDTO, UpdateLicenseDTO, LicenseFilters, Pagination, PaginatedResult } from '../types';

export function createLicense(dto: CreateLicenseDTO): LicenseWithRelations {
  const game = GamesRepo.findById(dto.game_id);
  if (!game) throw new AppError(404, `Game ${dto.game_id} not found`);
  if (game.status !== 'active') throw new AppError(409, 'Cannot license an inactive or deprecated game');

  const operator = OperatorsRepo.findById(dto.operator_id);
  if (!operator) throw new AppError(404, `Operator ${dto.operator_id} not found`);
  if (operator.status !== 'active') throw new AppError(409, 'Cannot issue a license to a suspended or inactive operator');

  return LicensesRepo.create(dto);
}

export function listLicenses(filters: LicenseFilters, pagination: Pagination): PaginatedResult<LicenseWithRelations> {
  const { rows, total } = LicensesRepo.findAll(filters, pagination);
  return {
    data: rows,
    pagination: { page: pagination.page, limit: pagination.limit, total, total_pages: Math.ceil(total / pagination.limit) },
  };
}

export function getLicense(id: string): LicenseWithRelations {
  const license = LicensesRepo.findById(id);
  if (!license) throw new AppError(404, 'License not found');
  return license;
}

export function updateLicense(id: string, dto: UpdateLicenseDTO): LicenseWithRelations {
  if (!LicensesRepo.findById(id)) throw new AppError(404, 'License not found');
  return LicensesRepo.update(id, dto);
}

export function deleteLicense(id: string): void {
  if (!LicensesRepo.findById(id)) throw new AppError(404, 'License not found');
  LicensesRepo.remove(id);
}
