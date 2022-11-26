import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound.exception';
import { HttpExceptionFilter } from 'src/users/filters/HttpException.filter';
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
  @Get('username/:username')
  getUserByUsername(@Param('username') username: string) {
    const user = this.usersService.findUserByUsername(username);

    if (user) {
      return new SerializedUser(user);
    } else {
      throw new UserNotFoundException();
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('id/:id')
  @UseFilters(HttpExceptionFilter)
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.findUserById(id);

    if (user) {
      return new SerializedUser(user);
    } else {
      throw new UserNotFoundException();
    }
  }
}
