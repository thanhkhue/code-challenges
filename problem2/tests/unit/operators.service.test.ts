import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as OperatorsRepo from '../../src/repositories/operators.repository';
import * as OperatorsService from '../../src/services/operators.service';
import type { Operator } from '../../src/types';

vi.mock('../../src/repositories/operators.repository');

const mockOperator: Operator = {
  id: 'uuid-o1', name: 'LuckyCasino', jurisdiction: 'MGA',
  tier: 'enterprise', contact_email: null, status: 'active',
  created_at: '2024-01-01', updated_at: '2024-01-01', deleted_at: null,
};

beforeEach(() => vi.clearAllMocks());

describe('getOperator', () => {
  it('returns operator when found', () => {
    vi.mocked(OperatorsRepo.findById).mockReturnValue(mockOperator);
    expect(OperatorsService.getOperator('uuid-o1')).toEqual(mockOperator);
  });

  it('throws 404 when not found', () => {
    vi.mocked(OperatorsRepo.findById).mockReturnValue(undefined);
    expect(() => OperatorsService.getOperator('uuid-o1'))
      .toThrow(expect.objectContaining({ statusCode: 404, message: 'Operator not found' }));
  });
});

describe('deleteOperator', () => {
  it('throws 409 when operator has licenses', () => {
    vi.mocked(OperatorsRepo.findById).mockReturnValue(mockOperator);
    vi.mocked(OperatorsRepo.countLicenses).mockReturnValue(1);
    expect(() => OperatorsService.deleteOperator('uuid-o1'))
      .toThrow(expect.objectContaining({ statusCode: 409 }));
  });

  it('soft-deletes when no licenses exist', () => {
    vi.mocked(OperatorsRepo.findById).mockReturnValue(mockOperator);
    vi.mocked(OperatorsRepo.countLicenses).mockReturnValue(0);
    OperatorsService.deleteOperator('uuid-o1');
    expect(OperatorsRepo.remove).toHaveBeenCalledWith('uuid-o1');
  });
});
