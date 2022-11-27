import { Controller, Get, Post, Req, Session, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard, LocalAuthGuard } from 'src/auth/utils/LocalGuard';

@Controller('auth')
export class AuthController {
  @Get('')
  async getAuthSession(@Session() session: Record<string, any>) {
    session.authorizated = true;
    return session;
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async getStatus(@Req() req: Request) {
    return req.user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    //
  }
}
