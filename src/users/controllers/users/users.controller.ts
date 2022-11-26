import {
  Controller,
  Get,
  Inject,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { SerializedUser } from 'src/users/types';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
  ) {}

  @Get('')
  getUsers() {
    return this.usersService.findUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    const user = this.usersService.findUserByUsername(username);

    if (user) {
      return new SerializedUser(user);
    } else {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }
}
