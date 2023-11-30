import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ApiPort, DocsPath } from './constants';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Malaria API')
    .setVersion('PoC')
    .addBearerAuth();

  config.addTag('sivep');

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup(DocsPath, app, document);

  console.log(`API running on 0.0.0.0:${ApiPort}`);
  console.log(`Documentation available on 0.0.0.0:${ApiPort}/${DocsPath}`);
  await app.listen(ApiPort);
}

bootstrap();
