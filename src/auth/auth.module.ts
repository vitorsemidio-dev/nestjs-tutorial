import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/auth/controllers/auth/auth.controller';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LocalStrategy } from 'src/auth/utils/LocalStrategy';
import { User } from 'src/users/entities/User.entity';
import { HashService } from 'src/users/services/hash/hash.service';
import { UsersService } from 'src/users/services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'HASH_SERVICE',
      useClass: HashService,
    },
    LocalStrategy,
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
  ],
})
export class AuthModule {}
