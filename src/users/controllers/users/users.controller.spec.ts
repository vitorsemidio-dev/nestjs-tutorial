import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { appDataSource } from 'src/test/test.utils';
import { createUserDtoManyFactory, usersFixture } from 'src/test/users.fixture';
import { UsersController } from 'src/users/controllers/users/users.controller';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/entities/User.entity';
import { UserEmailAlreadyExits } from 'src/users/exceptions/UserEmailAlreadyExists.exception';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound.exception';
import { HashService } from 'src/users/services/hash/hash.service';
import { UsersService } from 'src/users/services/users/users.service';
import { Repository } from 'typeorm';

const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
const HASH_SERVICE_TOKEN = 'HASH_SERVICE';
const USER_SERVICE_TOKEN = 'USER_SERVICE';

const hashFnMock = (payload: string) => `${payload}hashed`;

const makeSut = () => {
  const [user1, user2] = usersFixture.map((user) => ({
    ...user,
    password: hashFnMock(user.password),
  }));
  return {
    user1,
    user2,
  };
};

const createUserDtoFactorySut = (quantity = 1) => {
  const entitiesGenerated: CreateUserDto[] = createUserDtoManyFactory(quantity);
  return entitiesGenerated;
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let hashService: HashService;

  beforeEach(async () => {
    await appDataSource.initialize();
    const { user1, user2 } = makeSut();
    const userDb: User[] = [user1, user2];
    const usersRepositoryStub = appDataSource.getRepository(User);
    await usersRepositoryStub.save(userDb);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: USER_SERVICE_TOKEN,
          useClass: UsersService,
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((x) => usersRepositoryStub.create(x)),
            find: jest.fn(async () => usersRepositoryStub.find()),
            findOne: jest.fn(async (x) => usersRepositoryStub.findOne(x)),
            save: jest.fn(async (x) => usersRepositoryStub.save(x)),
            createQueryBuilder: jest.fn((x) =>
              usersRepositoryStub.createQueryBuilder(x),
            ),
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
    usersService = module.get<UsersService>(USER_SERVICE_TOKEN);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    hashService = module.get<HashService>(HASH_SERVICE_TOKEN);
  });

  afterEach(async () => {
    if (appDataSource) {
      await appDataSource.destroy();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(hashService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return users without password', async () => {
      const usersWithoutPassword = await controller.getUsers();
      const usersWithPassword = await usersService.findUsers();
      usersWithoutPassword.forEach((user) =>
        expect(user.password).toBeUndefined(),
      );
      expect(usersWithPassword).toEqual(
        expect.arrayContaining(
          usersWithoutPassword.map((user) => expect.objectContaining(user)),
        ),
      );
    });

    it('should check if properties values (without password) are the same', async () => {
      const usersWithoutPassword = await controller.getUsers();
      const usersWithPassword = await usersService.findUsers();
      expect(usersWithPassword).toEqual(
        expect.arrayContaining(
          usersWithoutPassword.map((user) => expect.objectContaining(user)),
        ),
      );
    });

    it('should return empty array when has no user', async () => {
      await usersRepository
        .createQueryBuilder('users')
        .delete()
        .from(User)
        .execute();
      const users = await controller.getUsers();
      expect(users.length).toEqual(0);
    });

    it('should check if return correct quantity', async () => {
      const usersResponseController = await controller.getUsers();
      const usersResultService = await usersService.findUsers();
      expect(usersResponseController.length).toEqual(usersResultService.length);
    });
  });

  describe('getUserById', () => {
    it('should return user WITH password because decorator @UseInterceptors(ClassSerializerInterceptor) remove [TODO: test in e2e]', async () => {
      const [usersFromDb] = await usersRepository.find({ take: 1 });
      const userWithoutPassword = await controller.getUserById(usersFromDb.id);
      expect(userWithoutPassword.password).toBeDefined();
      expect(usersFromDb).toEqual(expect.objectContaining(userWithoutPassword));
    });

    it('should check if properties values are the same', async () => {
      const [usersFromDb] = await usersRepository.find({ take: 1 });
      const userResponse = await controller.getUserById(usersFromDb.id);
      expect(usersFromDb).toEqual(expect.objectContaining(userResponse));
    });

    it('should throw UserNotFoundException', async () => {
      const [usersFromDb] = await usersRepository.find({ take: 1 });
      await usersRepository
        .createQueryBuilder('users')
        .delete()
        .from(User)
        .execute();
      const output = controller.getUserById(usersFromDb.id);
      expect(output).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('getUserByUsername', () => {
    it('should return user WITH password because decorator @UseInterceptors(ClassSerializerInterceptor) remove [TODO: test in e2e]', async () => {
      const [usersFromDb] = await usersRepository.find({ take: 1 });
      const userWithoutPassword = await controller.getUserByUsername(
        usersFromDb.username,
      );
      expect(userWithoutPassword.password).toBeDefined();
      expect(usersFromDb).toEqual(expect.objectContaining(userWithoutPassword));
    });

    it('should check if properties values are the same', async () => {
      const [usersFromDb] = await usersRepository.find({ take: 1 });
      const userResponse = await controller.getUserByUsername(
        usersFromDb.username,
      );
      expect(usersFromDb).toEqual(expect.objectContaining(userResponse));
    });

    it('should throw UserNotFoundException', async () => {
      const [usersFromDb] = await usersRepository.find({ take: 1 });
      await usersRepository
        .createQueryBuilder('users')
        .delete()
        .from(User)
        .execute();
      const output = controller.getUserByUsername(usersFromDb.username);
      expect(output).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create user correctly', async () => {
      const [input] = createUserDtoFactorySut();
      const expectedFieldsValues = [
        { field: 'email', value: input.email },
        { field: 'username', value: input.username },
      ];
      const output = await controller.createUser(input);
      expectedFieldsValues.forEach((expected) => {
        expect(output[expected.field]).toEqual(expected.value);
      });
    });

    it('should create user and encrypt password before save in database', async () => {
      const [input] = createUserDtoFactorySut();
      const expected = input.password;
      const output = await controller.createUser(input);
      expect(output).not.toEqual(expected);
    });

    it(`should return field 'password'`, async () => {
      const [input] = createUserDtoFactorySut();
      const expected = true;
      const output = await controller.createUser(input);
      expect(!!output.password).toEqual(expected);
    });

    it(`should throw ${UserEmailAlreadyExits.name}`, async () => {
      const [input] = createUserDtoFactorySut();
      await controller.createUser(input);
      const output = controller.createUser(input);
      await expect(output).rejects.toThrow(UserEmailAlreadyExits);
    });
  });
});
