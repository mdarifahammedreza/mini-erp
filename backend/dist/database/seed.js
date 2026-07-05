"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const seeder_service_1 = require("./seeders/seeder.service");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('SeederBootstrap');
    logger.log('Starting database seeding...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seederService = app.get(seeder_service_1.SeederService);
    try {
        await seederService.seed();
        logger.log('Database seeding completed successfully!');
    }
    catch (error) {
        logger.error('Database seeding failed!', error);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map