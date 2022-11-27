import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User as UserEntity } from 'src/users/entities/User.entity';
import { UserEmailAlreadyExits } from 'src/users/exceptions/UserEmailAlreadyExists.exception';
import { SerializedUser, User as UserType } from 'src/users/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private users: UserType[] = [
    {
      id: 1,
      username: 'shane',
      password: 'shane',
    },
    {
      id: 2,
      username: 'don',
      password: 'don',
    },
    {
      id: 3,
      username: 'gussie',
      password: 'gussie',
    },
  ];

  async createUser(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this.findUserByEmail(createUserDto.email);
    if (userAlreadyExists) {
      throw new UserEmailAlreadyExits(
        `User with email "${createUserDto.email}" provided already exists`,
      );
    }
    const userCreated = this.usersRepository.create(createUserDto);
    const userSaved = await this.usersRepository.save(userCreated);
    return userSaved;
  }

  findUsers() {
    return this.users.map((user) => plainToClass(SerializedUser, user));
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  findUserByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  findUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
