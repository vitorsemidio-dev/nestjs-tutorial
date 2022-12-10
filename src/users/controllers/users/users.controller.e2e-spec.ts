import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { createUserDtoManyFactory } from 'src/test/users.fixture';

const createUserDtoFactorySut = (quantity = 1) => {
  const entitiesGenerated: CreateUserDto[] = createUserDtoManyFactory(quantity);
  return entitiesGenerated;
};

describe('UsersController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', async () => {
    const path = '/users';
    const expectedBody = [];
    const expectedStatusCode = 200;
    await request(app.getHttpServer())
      .get(path)
      .expect(expectedStatusCode)
      .expect(expectedBody);
  });

  it('/users/create (POST)', async () => {
    const path = '/users/create';
    const [input] = createUserDtoFactorySut();
    const expectedStatusCode = 201;
    const expectedBody = {
      id: expect.any(Number),
      email: input.email,
      username: input.username,
    };
    const output = await request(app.getHttpServer())
      .post(path)
      .send(input)
      .expect(expectedStatusCode);
    expect(output.body).toEqual(expectedBody);
  });
});
