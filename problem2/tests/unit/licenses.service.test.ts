import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as LicensesRepo from '../../src/repositories/licenses.repository';
import * as GamesRepo from '../../src/repositories/games.repository';
import * as OperatorsRepo from '../../src/repositories/operators.repository';
import * as LicensesService from '../../src/services/licenses.service';
import type { Game, Operator, LicenseWithRelations } from '../../src/types';

vi.mock('../../src/repositories/licenses.repository');
vi.mock('../../src/repositories/games.repository');
vi.mock('../../src/repositories/operators.repository');

const mockGame: Game = {
  id: 'uuid-g1', name: 'Book of Ra', provider: 'Novomatic',
  genre: 'slots', platform: 'both', rtp: 95.1, volatility: 'high',
  description: null, status: 'active',
  created_at: '2024-01-01', updated_at: '2024-01-01', deleted_at: null,
};

const mockOperator: Operator = {
  id: 'uuid-o1', name: 'LuckyCasino', jurisdiction: 'MGA',
  tier: 'enterprise', contact_email: null, status: 'active',
  created_at: '2024-01-01', updated_at: '2024-01-01', deleted_at: null,
};

const mockLicense: LicenseWithRelations = {
  id: 'uuid-l1', game_id: 'uuid-g1', operator_id: 'uuid-o1',
  type: 'subscription', revenue_share_pct: 15,
  start_date: '2024-01-01', expiry_date: '2025-01-01', status: 'active',
  created_at: '2024-01-01', updated_at: '2024-01-01', deleted_at: null,
  game_name: 'Book of Ra', game_provider: 'Novomatic', operator_name: 'LuckyCasino',
};

const createDto = {
  game_id: 'uuid-g1', operator_id: 'uuid-o1', type: 'subscription' as const,
  revenue_share_pct: 15, start_date: '2024-01-01', status: 'active' as const,
};

beforeEach(() => vi.clearAllMocks());

describe('createLicense', () => {
  it('throws 404 when game not found', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(undefined);
    expect(() => LicensesService.createLicense(createDto))
      .toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  it('throws 409 when game is not active', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue({ ...mockGame, status: 'deprecated' });
    expect(() => LicensesService.createLicense(createDto))
      .toThrow(expect.objectContaining({ statusCode: 409, message: 'Cannot license an inactive or deprecated game' }));
  });

  it('throws 404 when operator not found', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    vi.mocked(OperatorsRepo.findById).mockReturnValue(undefined);
    expect(() => LicensesService.createLicense(createDto))
      .toThrow(expect.objectContaining({ statusCode: 404 }));
  });

  it('throws 409 when operator is suspended', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    vi.mocked(OperatorsRepo.findById).mockReturnValue({ ...mockOperator, status: 'suspended' });
    expect(() => LicensesService.createLicense(createDto))
      .toThrow(expect.objectContaining({ statusCode: 409, message: 'Cannot issue a license to a suspended or inactive operator' }));
  });

  it('creates license when all checks pass', () => {
    vi.mocked(GamesRepo.findById).mockReturnValue(mockGame);
    vi.mocked(OperatorsRepo.findById).mockReturnValue(mockOperator);
    vi.mocked(LicensesRepo.create).mockReturnValue(mockLicense);
    expect(LicensesService.createLicense(createDto)).toEqual(mockLicense);
  });
});

describe('getLicense', () => {
  it('throws 404 when not found', () => {
    vi.mocked(LicensesRepo.findById).mockReturnValue(undefined);
    expect(() => LicensesService.getLicense('uuid-l1'))
      .toThrow(expect.objectContaining({ statusCode: 404, message: 'License not found' }));
  });
});
