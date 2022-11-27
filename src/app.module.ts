import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CustomersModule } from 'src/customers/customers.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    AuthModule,
    CustomersModule,
    DatabaseModule,
    PaymentsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
