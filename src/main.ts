import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { AppModule } from 'src/app.module';
import { sessionConfig } from 'src/config/session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(sessionConfig(app));
  app.use(passport.initialize());
  app.use(passport.session());
  const port = 3000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
