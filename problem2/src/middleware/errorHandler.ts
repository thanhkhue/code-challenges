import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: err.issues.map(i => i.message).join('; ') });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // better-sqlite3 constraint violations
  const sqliteErr = err as NodeJS.ErrnoException;
  if (sqliteErr.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }
  if (sqliteErr.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    res.status(400).json({ error: 'Referenced resource does not exist' });
    return;
  }

  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
