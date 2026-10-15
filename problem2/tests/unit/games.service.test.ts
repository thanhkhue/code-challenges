import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as GamesRepo from '../../src/repositories/games.repository';
import * as GamesService from '../../src/services/games.service';
import { AppError } from '../../src/middleware/errorHandler';
import type { Game } from '../../src/types';

vi.mock('../../src/repositories/games.repository');

const mockGame: Game = {
  id: 'uuid-1', name: 'Book of Ra', provider: 'Novomatic',
  genre: 'slots', platform: 'both', rtp: 95.1, volatility: 'high',
  description: null, status: 'active',
  created_at: '2024-01-01', updated_at: '2024-01-01', deleted_at: null,
};

beforeEach(() => vi.clearAllMocks());

describe('getGame', () => {
  it('returns the game when found', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    expect(GamesService.getGame('uuid-1')).toEqual(mockGame);
  });

  it('throws 404 when not found', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(undefined);
    expect(() => GamesService.getGame('uuid-1'))
      .toThrow(expect.objectContaining({ statusCode: 404, message: 'Game not found' }));
  });
});

describe('updateGame', () => {
  it('throws 404 when game does not exist', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(undefined);
    expect(() => GamesService.updateGame('uuid-1', { name: 'New Name' }))
      .toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  it('calls repo.update and returns result', () => {
    const updated = { ...mockGame, name: 'New Name' };
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    vi.mocked(GamesRepo.update).mockReturnValue(updated);
    expect(GamesService.updateGame('uuid-1', { name: 'New Name' })).toEqual(updated);
  });
});

describe('deleteGame', () => {
  it('throws 404 when game does not exist', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(undefined);
    expect(() => GamesService.deleteGame('uuid-1'))
      .toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  it('throws 409 when game has active licenses', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    vi.mocked(GamesRepo.countLicenses).mockReturnValue(2);
    expect(() => GamesService.deleteGame('uuid-1'))
      .toThrow(expect.objectContaining({ statusCode: 409 }));
  });

  it('soft-deletes when no licenses exist', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    vi.mocked(GamesRepo.countLicenses).mockReturnValue(0);
    GamesService.deleteGame('uuid-1');
    expect(GamesRepo.remove).toHaveBeenCalledWith('uuid-1');
  });
});
