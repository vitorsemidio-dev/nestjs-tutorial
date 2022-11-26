import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ValidateCustomerAccountMiddleware } from 'src/middlewares/validate-customer-account.middleware';
import { ValidateCustomerMiddleware } from 'src/middlewares/validate-customer.middleware';
import { CustomersController } from './controllers/customers/customers.controller';
import { CustomersService } from './services/customers/customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ValidateCustomerMiddleware,
        ValidateCustomerAccountMiddleware,
        (req: Request, res: Response, next: NextFunction) => {
          console.log('Last Middleware');
          next();
        },
      )
      .exclude(
        {
          path: 'api/customers/create',
          method: RequestMethod.POST,
        },
        {
          path: 'api/customers/:id',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(CustomersController);
  }
}
