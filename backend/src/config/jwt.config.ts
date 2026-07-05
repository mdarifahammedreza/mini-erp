import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'super-secret-access-token-key-must-be-long-32-chars',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-must-be-long-32-chars',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
