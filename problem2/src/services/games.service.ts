import * as GamesRepo from '../repositories/games.repository';
import { AppError } from '../middleware/errorHandler';
import { Game, CreateGameDTO, UpdateGameDTO, GameFilters, Pagination, PaginatedResult } from '../types';

export function createGame(dto: CreateGameDTO): Game {
  return GamesRepo.create(dto);
}

export function listGames(filters: GameFilters, pagination: Pagination): PaginatedResult<Game> {
  const { rows, total } = GamesRepo.findAll(filters, pagination);
  return {
    data: rows,
    pagination: { page: pagination.page, limit: pagination.limit, total, total_pages: Math.ceil(total / pagination.limit) },
  };
}

export function getGame(id: string): Game {
  const game = GamesRepo.findById(id);
  if (!game) throw new AppError(404, 'Game not found');
  return game;
}

export function updateGame(id: string, dto: UpdateGameDTO): Game {
  if (!GamesRepo.findById(id)) throw new AppError(404, 'Game not found');
  return GamesRepo.update(id, dto);
}

export function deleteGame(id: string): void {
  if (!GamesRepo.findById(id)) throw new AppError(404, 'Game not found');

  const licenseCount = GamesRepo.countLicenses(id);
  if (licenseCount > 0)
    throw new AppError(409, `Cannot delete game with ${licenseCount} license(s). Remove licenses first.`);

  GamesRepo.remove(id);
}
