import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SerializedUser, User } from 'src/users/types';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      username: 'shane',
      password: 'shane',
    },
    {
      username: 'don',
      password: 'don',
    },
    {
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
}
