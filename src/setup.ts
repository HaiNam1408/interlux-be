import { ValidationPipe, ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AdminModule } from './api/admin/admin.module';
import { ClientModule } from './api/client/client.module';

export function setupApp(app: NestExpressApplication) {
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // ========== Swagger for CLIENT ==========
  const clientConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Client API')
    .setDescription('API documentation for client-facing endpoints')
    .setVersion('1.0')
    .addTag('Client')
    .build();
  const clientDocument = SwaggerModule.createDocument(app, clientConfig, {
    include: [ClientModule],
  });
  SwaggerModule.setup('api/docs/client', app, clientDocument);

  // ========== Swagger for ADMIN ==========
  const adminConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Admin API')
    .setDescription('API documentation for admin-facing endpoints')
    .setVersion('1.0')
    .addTag('Admin')
    .build();
  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AdminModule],
  });
  SwaggerModule.setup('api/docs/admin', app, adminDocument);
}
