import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  findAllCustomers() {
    return [
      {
        id: 1,
        email: 'po@tuwzacwi.ru',
        createdAt: new Date(),
      },
      {
        id: 2,
        email: 'ipi@febzoziz.dm',
        createdAt: new Date(),
      },
    ];
  }
}
