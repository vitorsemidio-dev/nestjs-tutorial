import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CustomersModule } from 'src/customers/customers.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, CustomersModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
