import { HttpException, HttpStatus } from '@nestjs/common';

export class UserEmailAlreadyExits extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'User with email provided already exists',
      status || HttpStatus.BAD_REQUEST,
    );
  }
}
