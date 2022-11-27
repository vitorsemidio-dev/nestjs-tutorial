import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/users/controllers/users/users.controller';
import { SessionEntity } from 'src/users/entities/Session.entity';
import { User } from 'src/users/entities/User.entity';
import { HashService } from 'src/users/services/hash/hash.service';
import { UsersService } from 'src/users/services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, User])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'HASH_SERVICE',
      useClass: HashService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
