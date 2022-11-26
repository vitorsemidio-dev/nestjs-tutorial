import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidateCustomerAccountMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('ValidateCustomerAccountMiddleware!');
    const { valid } = req.headers;
    if (valid) {
      next();
    } else {
      return res.status(401).send({ error: 'Invalid Account' });
    }
  }
}
