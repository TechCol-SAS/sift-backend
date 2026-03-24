import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const logger = new Logger('Sift Backend');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  logger.log(
    `Servidor corriendo en http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

bootstrap().catch((error) => {
  logger.error('Fallo al iniciar la aplicacion', error);
  process.exit(1);
});
