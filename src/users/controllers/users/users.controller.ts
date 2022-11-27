import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound.exception';
import { HttpExceptionFilter } from 'src/users/filters/HttpException.filter';
import { UsersService } from 'src/users/services/users/users.service';
import { SerializedUserDto } from 'src/users/dtos/SerializedUserDto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
  ) {}

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers(): Promise<SerializedUserDto[]> {
    const users = await this.usersService.findUsers();
    return users.map((user) => plainToClass(SerializedUserDto, user));
  }

  @Get('id/:id')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SerializedUserDto> {
    const user = await this.usersService.findUserById(id);

    if (user) {
      return new SerializedUserDto(user);
    } else {
      throw new UserNotFoundException();
    }
  }

  @Get('username/:username')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<SerializedUserDto> {
    const user = await this.usersService.findUserByUsername(username);

    if (user) {
      return new SerializedUserDto(user);
    } else {
      throw new UserNotFoundException();
    }
  }

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SerializedUserDto> {
    const user = await this.usersService.createUser(createUserDto);
    return new SerializedUserDto(user);
  }
}
