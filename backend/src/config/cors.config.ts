import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
}));
