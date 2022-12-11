import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { createUserDtoManyFactory } from 'src/test/users.fixture';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UserEmailAlreadyExits } from 'src/users/exceptions/UserEmailAlreadyExists.exception';
import * as request from 'supertest';

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

  it('/users (GET) - should return 200 and an empty array when has no data', async () => {
    const path = '/users';
    const expectedBody = [];
    const expectedStatusCode = 200;
    await request(app.getHttpServer())
      .get(path)
      .expect(expectedStatusCode)
      .expect(expectedBody);
  });

  it('/users/create (POST) - should return 201 when create a new user', async () => {
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

  it('/users/create (POST) - should return 400 when email is already in use', async () => {
    const path = '/users/create';
    const [input] = createUserDtoFactorySut();
    const expectedStatusCode = 400;
    const expectedError = new UserEmailAlreadyExits(
      `User with email "${input.email}" provided already exists`,
    );
    const expectedBody = {
      message: expectedError.message,
      statusCode: expectedError.getStatus(),
    };
    await request(app.getHttpServer()).post(path).send(input).expect(201);
    const output = await request(app.getHttpServer())
      .post(path)
      .send(input)
      .expect(expectedStatusCode);
    expect(output.body).toEqual(expectedBody);
  });
});
