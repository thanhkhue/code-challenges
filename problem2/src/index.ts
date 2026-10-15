import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const app  = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.API_KEY) {
    console.warn('Warning: API_KEY is not set — authentication is disabled');
  }
});

export default app;
