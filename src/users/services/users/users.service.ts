import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/entities/User.entity';
import { UserEmailAlreadyExits } from 'src/users/exceptions/UserEmailAlreadyExists.exception';
import { HashService } from 'src/users/services/hash/hash.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject('HASH_SERVICE')
    private readonly hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this.findUserByEmail(createUserDto.email);
    if (userAlreadyExists) {
      throw new UserEmailAlreadyExits(
        `User with email "${createUserDto.email}" provided already exists`,
      );
    }
    const passwordHashed = this.hashService.hash(createUserDto.password);
    const userCreated = this.usersRepository.create({
      ...createUserDto,
      password: passwordHashed,
    });
    const userSaved = await this.usersRepository.save(userCreated);
    return userSaved;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return user;
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    return user;
  }

  async findUsers() {
    const users = await this.usersRepository.find();
    return users;
  }
}
