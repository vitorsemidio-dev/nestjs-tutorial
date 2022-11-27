import { INestApplication } from '@nestjs/common';
import { TypeormStore } from 'connect-typeorm';
import * as session from 'express-session';
import { SessionEntity } from 'src/users/entities/Session.entity';
import { DataSource } from 'typeorm';

export const sessionConfig = (app: INestApplication) =>
  session({
    name: 'NESTJS_SESSION_ID',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60_000,
    },
    store: new TypeormStore().connect(
      app.get(DataSource).getRepository(SessionEntity),
    ),
  });
