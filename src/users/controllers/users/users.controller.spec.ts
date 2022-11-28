import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from 'src/users/controllers/users/users.controller';
import { User } from 'src/users/entities/User.entity';

const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
const HASH_SERVICE_TOKEN = 'HASH_SERVICE';
const USER_SERVICE_TOKEN = 'USER_SERVICE';

const hashFnMock = (payload: string) => `${payload}hashed`;
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: USER_SERVICE_TOKEN,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((x) => ({ ...x, id: 1 })),
            find: jest.fn(() => []),
            findOne: jest.fn((x) => x),
            save: jest.fn((x) => x),
          },
        },
        {
          provide: HASH_SERVICE_TOKEN,
          useValue: {
            compare: jest.fn((x, y) => hashFnMock(x) === y),
            hash: jest.fn((x) => hashFnMock(x)),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
