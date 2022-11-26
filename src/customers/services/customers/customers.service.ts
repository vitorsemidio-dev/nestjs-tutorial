import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  private users = [
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

  findAllCustomers() {
    return this.users;
  }

  findCustomerById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
