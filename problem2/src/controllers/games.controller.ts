import { Request, Response, NextFunction } from 'express';
import * as GamesService from '../services/games.service';
import { createGameSchema, updateGameSchema, listGamesSchema } from '../validators/games.validator';

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const dto = createGameSchema.parse(req.body);
    res.status(201).json({ data: GamesService.createGame(dto) });
  } catch (err) { next(err); }
}

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const { page, limit, ...filters } = listGamesSchema.parse(req.query);
    res.json(GamesService.listGames(filters, { page, limit }));
  } catch (err) { next(err); }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    res.json({ data: GamesService.getGame(req.params.id) });
  } catch (err) { next(err); }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const dto = updateGameSchema.parse(req.body);
    res.json({ data: GamesService.updateGame(req.params.id, dto) });
  } catch (err) { next(err); }
}

export function remove(req: Request, res: Response, next: NextFunction): void {
  try {
    GamesService.deleteGame(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
