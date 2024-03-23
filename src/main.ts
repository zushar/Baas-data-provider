import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RootConfig } from './config/env.validation';
import HttpExceptionFilter from './common/filters/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    const { PORT } = app.get(RootConfig);

    // apply global exception filter
    const filter = new HttpExceptionFilter();
    app.useGlobalFilters(filter);

    // apply with class-validator
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        transform: true, // Automatically transform payloads to match DTO classes
      }),
    );

    await app.listen(3000);
    Logger.log(`Server started on port ${PORT}`);
  } catch (error) {
    Logger.error(`Failed to start server`, error);
    process.exit(1);
  }
}
bootstrap();
