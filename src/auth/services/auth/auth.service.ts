import { Inject, Injectable } from '@nestjs/common';
import { HashService } from 'src/users/services/hash/hash.service';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('HASH_SERVICE')
    private readonly hashService: HashService,
    @Inject('USER_SERVICE')
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isMatchPassword = this.hashService.compare(pass, user.password);
    if (!isMatchPassword) {
      return null;
    }
    return user;
  }
}
