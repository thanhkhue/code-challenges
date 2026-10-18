import express, { Express } from 'express';
import helmet from 'helmet';
import cors   from 'cors';
import gamesRouter     from './routes/games';
import operatorsRouter from './routes/operators';
import licensesRouter  from './routes/licenses';
import { errorHandler } from './middleware/errorHandler';
import { apiKeyAuth }   from './middleware/apiKey';
import { logger }       from './lib/logger';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use((req, _res, next) => {
    logger.info({ method: req.method, url: req.url }, 'request');
    next();
  });

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api', apiKeyAuth);
  app.use('/api/games',     gamesRouter);
  app.use('/api/operators', operatorsRouter);
  app.use('/api/licenses',  licensesRouter);

  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use(errorHandler);

  return app;
}
