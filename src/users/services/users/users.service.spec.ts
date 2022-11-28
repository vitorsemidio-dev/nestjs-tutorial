import { UserEmailAlreadyExits } from './../../exceptions/UserEmailAlreadyExists.exception';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { User } from './../../entities/User.entity';
import { UsersService } from './users.service';

const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
const HASH_SERVICE_TOKEN = 'HASH_SERVICE';

const hashFnMock = (payload: string) => `${payload}hashed`;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    hashService = module.get<HashService>(HASH_SERVICE_TOKEN);
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
      jest
        .spyOn(usersService, 'findUserByEmail')
        .mockImplementationOnce(() => null);
      await usersService.createUser(input);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...input,
        password: '12345678hashed',
      });
    });

    it('should call the methods with correct values', async () => {
      const { input } = makeInputDto();
      const passwordHashed = hashFnMock(input.password);
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValueOnce(null);
      jest.spyOn(usersRepository, 'create').mockReturnValueOnce({
        ...input,
        password: passwordHashed,
        id: 1,
      });
      await usersService.createUser(input);
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(input.email);
      expect(hashService.hash).toHaveBeenCalledWith(input.password);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...input,
        password: passwordHashed,
      });
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...input,
        password: passwordHashed,
        id: 1,
      });
    });

    it('should save a new user with id generated', async () => {
      const { input } = makeInputDto();
      const passwordHashed = hashFnMock(input.password);
      jest
        .spyOn(usersService, 'findUserByEmail')
        .mockImplementationOnce(() => null);
      jest.spyOn(usersRepository, 'create').mockImplementationOnce(() => ({
        ...input,
        password: passwordHashed,
        id: 1,
      }));
      await usersService.createUser(input);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...input,
        password: passwordHashed,
        id: 1,
      });
    });

    it('should not be able to create a user with a e-mail already in use', async () => {
      const { input } = makeInputDto();
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValueOnce({
        id: 10,
        email: input.email,
        password: 'any_password_hashed',
        username: 'any_username',
      });
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
      const { email } = makeInputEmail();
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: email,
        username: 'dimluip',
        password: '12345678hashed',
      });
      const output = await usersService.findUserByEmail(email);
      expect(output).toBeDefined();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(output).toMatchObject({
        id: 1,
        email,
        username: 'dimluip',
        password: '12345678hashed',
      });
    });

    it('should return "null" if email not exists', async () => {
      const { email } = makeInputEmail();
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      const output = await usersService.findUserByEmail(email);
      expect(output).toBeNull();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should call the methods with correct values', async () => {
      const { email } = makeInputEmail();
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      await usersService.findUserByEmail(email);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
});
