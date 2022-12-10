import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { CustomersModule } from 'src/customers/customers.module';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    CommonModule,
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
