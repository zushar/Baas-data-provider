import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RootConfig } from './config/env.validation';
import HttpExceptionFilter from './common/filters/http-exception-filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    const rootConfig = app.get(RootConfig);
    const { PORT } = rootConfig;

    app.use(cookieParser());

    // Apply global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Enable CORS
    app.enableCors({
      origin: '*', // Replace with specific origin or array of origins if needed
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Apply global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        transform: true, // Automatically transform payloads to match DTO classes
      }),
    );

    await app.listen(PORT || 3000);
    Logger.log(`Server started on port ${PORT || 3000}`);
  } catch (error) {
    if (error instanceof Error) {
      Logger.error('Failed to start server', error.stack);
      process.exit(1);
    } else {
      Logger.error('Failed to start server', error);
      process.exit(1);
    }
  }
}
bootstrap();
