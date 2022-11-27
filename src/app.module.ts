import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, CustomersModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
