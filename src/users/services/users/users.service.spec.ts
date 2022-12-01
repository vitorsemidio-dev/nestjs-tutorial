import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { appDataSource } from 'src/test/test.utils';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/entities/User.entity';
import { UserEmailAlreadyExits } from 'src/users/exceptions/UserEmailAlreadyExists.exception';
import { HashService } from 'src/users/services/hash/hash.service';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { usersFixture } from 'src/test/users.fixture';

const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
const HASH_SERVICE_TOKEN = 'HASH_SERVICE';

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

describe('UsersService', () => {
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
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((x) => usersRepositoryStub.create(x)),
            find: jest.fn(async () => usersRepositoryStub.find()),
            findOne: jest.fn(async (x) => usersRepositoryStub.findOne(x)),
            save: jest.fn(async (x) => usersRepositoryStub.save(x)),
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

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    hashService = module.get<HashService>(HASH_SERVICE_TOKEN);
  });

  afterEach(async () => {
    if (appDataSource) {
      await appDataSource.destroy();
    }
  });

  describe('dependencies should be defined', () => {
    it('usersService should be defined', () => {
      expect(usersService).toBeDefined();
    });

    it('usersRepository should be defined', () => {
      expect(usersRepository).toBeDefined();
    });

    it('hashService should be defined', () => {
      expect(hashService).toBeDefined();
    });
  });

  describe('createUser', () => {
    const makeInputDto = () => {
      const input: CreateUserDto = {
        email: 'laizhe@pu.sx',
        password: '12345678',
        username: 'laizhe',
      };
      return { input };
    };
    it('should create a new user with encoded password', async () => {
      const { input } = makeInputDto();
      await usersService.createUser(input);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...input,
        password: '12345678hashed',
      });
    });

    it('should call the methods with correct values', async () => {
      const { input } = makeInputDto();
      const passwordHashed = hashFnMock(input.password);
      jest.spyOn(usersService, 'findUserByEmail');
      const output = await usersService.createUser(input);
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(input.email);
      expect(hashService.hash).toHaveBeenCalledWith(input.password);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...input,
        password: passwordHashed,
      });
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...input,
        password: passwordHashed,
        id: output.id,
      });
    });

    it('should save a new user with id generated', async () => {
      const { input } = makeInputDto();
      const passwordHashed = hashFnMock(input.password);
      const output = await usersService.createUser(input);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...input,
        password: passwordHashed,
        id: output.id,
      });
      expect(output).toHaveProperty('id');
    });

    it('should not be able to create a user with a e-mail already in use', async () => {
      const { user1: input } = makeSut();
      const output = usersService.createUser(input);
      await expect(output).rejects.toThrow(UserEmailAlreadyExits);
    });
  });

  describe('findUserByEmail', () => {
    const makeInputEmail = () => {
      const email = 'dimluip@mowan.nu';
      return { email };
    };
    it('should return user if email exists', async () => {
      const { user1 } = makeSut();
      const email = user1.email;
      const output = await usersService.findUserByEmail(email);
      expect(output).toBeDefined();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(output).toMatchObject(user1);
    });

    it('should return "null" if email not exists', async () => {
      const { email } = makeInputEmail();
      const output = await usersService.findUserByEmail(email);
      expect(output).toBeNull();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should call the methods with correct values', async () => {
      const { email } = makeInputEmail();
      await usersService.findUserByEmail(email);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findUserByUsername', () => {
    const makeInputUsername = () => {
      const username = 'dimluip@mowan.nu';
      return { username };
    };
    it('should return user if username exists', async () => {
      const { user2 } = makeSut();
      const { username } = user2;
      const output = await usersService.findUserByUsername(username);
      expect(output).toBeDefined();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(output).toMatchObject(user2);
    });

    it('should return "null" if username not exists', async () => {
      const { username } = makeInputUsername();
      const output = await usersService.findUserByUsername(username);
      expect(output).toBeNull();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('should call the methods with correct values', async () => {
      const { username } = makeInputUsername();
      await usersService.findUserByUsername(username);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe('findUserById', () => {
    const makeIdInput = () => {
      const id = 1234;
      return { id };
    };
    it('should return user if id exists', async () => {
      const { user2 } = makeSut();
      const { id } = user2;
      const output = await usersService.findUserById(id);
      expect(output).toBeDefined();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(output).toMatchObject(user2);
    });

    it('should return "null" if id not exists', async () => {
      const { id } = makeIdInput();
      const output = await usersService.findUserById(id);
      expect(output).toBeNull();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should call the methods with correct values', async () => {
      const { id } = makeIdInput();
      await usersService.findUserById(id);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('findUsers', () => {
    it('should return users from db', async () => {
      const { user1, user2 } = makeSut();
      const output = await usersService.findUsers();
      expect(output).toBeDefined();
      expect(usersRepository.find).toHaveBeenCalledWith();
      expect(output).toMatchObject([user1, user2]);
    });

    it('should return users from db when new user was created', async () => {
      const input: CreateUserDto = {
        email: 'laizhe@pu.sx',
        password: '12345678',
        username: 'laizhe',
      };
      const { user1, user2 } = makeSut();
      const userCreated = await usersService.createUser(input);
      const output = await usersService.findUsers();
      expect(output).toBeDefined();
      expect(usersRepository.find).toHaveBeenCalledWith();
      expect(output).toMatchObject([user1, user2, userCreated]);
    });
  });
});
