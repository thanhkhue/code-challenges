import { Request, Response, NextFunction } from 'express';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // No key configured — skip auth (development mode)
    next();
    return;
  }

  const provided = req.headers['x-api-key'];

  if (!provided || provided !== apiKey) {
    res.status(401).json({ error: 'Invalid or missing API key' });
    return;
  }

  next();
}
