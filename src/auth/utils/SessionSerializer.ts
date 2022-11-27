import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/entities/User.entity';
import { UsersService } from 'src/users/services/users/users.service';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
  ) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(payload: User, done: (err: Error, user: User) => void) {
    const user = await this.usersService.findUserById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
