import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SerializedUser, User } from 'src/users/types';

@Injectable()
export class UsersService {
  private users: User[] = [
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

  findUsers() {
    return this.users.map((user) => plainToClass(SerializedUser, user));
  }

  findUserByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  findUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
