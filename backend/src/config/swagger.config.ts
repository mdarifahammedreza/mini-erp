import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  title: 'Mini ERP API',
  description: 'The API documentation for Mini ERP application',
  version: '1.0',
  tag: 'mini-erp',
}));
