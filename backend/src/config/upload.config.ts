import { registerAs } from '@nestjs/config';

export default registerAs('upload', () => ({
  dest: process.env.UPLOAD_DEST || './uploads/products',
  maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
}));
