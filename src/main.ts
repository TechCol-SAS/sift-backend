import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Sift Backend')
    .setDescription('API RESTful para el sistema Sift')
    .setVersion('1.0')
    .addTag('sift')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(
    `Servidor corriendo en http://localhost:${process.env.PORT ?? 3000}/api`,
  );

  logger.log(
    `Documentacion disponible en http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}

bootstrap().catch((error) => {
  logger.error('Fallo al iniciar la aplicacion', error);
  process.exit(1);
});
