import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeders/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeederBootstrap');
  logger.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    await seederService.seed();
    logger.log('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Database seeding failed!', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
