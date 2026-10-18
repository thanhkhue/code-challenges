import { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import * as GamesService from '../services/games.service';
import { createGameSchema, updateGameSchema, listGamesSchema } from '../validators/games.validator';

type CreateBody = z.input<typeof createGameSchema>;
type UpdateBody = z.input<typeof updateGameSchema>;
type IdParams   = { id: string };
type ListQuery  = z.input<typeof listGamesSchema>;

export function create(req: Request<{}, {}, CreateBody>, res: Response, next: NextFunction): void {
  try {
    const dto = createGameSchema.parse(req.body);
    res.status(201).json({ data: GamesService.createGame(dto) });
  } catch (err) { next(err); }
}

export function list(req: Request<{}, {}, {}, ListQuery>, res: Response, next: NextFunction): void {
  try {
    const { page, limit, ...filters } = listGamesSchema.parse(req.query);
    res.json(GamesService.listGames(filters, { page, limit }));
  } catch (err) { next(err); }
}

export function getById(req: Request<IdParams>, res: Response, next: NextFunction): void {
  try {
    res.json({ data: GamesService.getGame(req.params.id) });
  } catch (err) { next(err); }
}

export function update(req: Request<IdParams, {}, UpdateBody>, res: Response, next: NextFunction): void {
  try {
    const dto = updateGameSchema.parse(req.body);
    res.json({ data: GamesService.updateGame(req.params.id, dto) });
  } catch (err) { next(err); }
}

export function remove(req: Request<IdParams>, res: Response, next: NextFunction): void {
  try {
    GamesService.deleteGame(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
