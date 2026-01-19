import { join } from 'path';
import * as moduleAlias from 'module-alias';

// Configure module-alias to resolve 'src' paths
moduleAlias.addAlias('src', join(__dirname, '..', 'src'));

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup';
import type { Request, Response } from 'express';

let cachedApp: NestExpressApplication;

async function bootstrap() {
  if (!cachedApp) {
    const adapter = new ExpressAdapter();
    const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter);
    
    setupApp(app);
    
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}
