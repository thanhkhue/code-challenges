import 'dotenv/config';
import { createApp } from './app';
import { logger }    from './lib/logger';

const PORT = process.env.PORT || 3000;
const app  = createApp();

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  if (!process.env.API_KEY) {
    logger.warn('API_KEY is not set — authentication is disabled');
  }
});

export default app;
