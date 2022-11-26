import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from 'src/customers/dtos/CreateCustomer.dto';
import { Customer } from 'src/customers/types/Customer';

@Injectable()
export class CustomersService {
  private users: Customer[] = [
    {
      id: 1,
      email: 'po@tuwzacwi.ru',
      name: 'Grace Wade',
    },
    {
      id: 2,
      email: 'ipi@febzoziz.dm',
      name: 'William Porter',
    },
  ];

  createCustomer(createCustomerDto: CreateCustomerDto) {
    this.users.push(createCustomerDto);
  }

  findAllCustomers() {
    return this.users;
  }

  findCustomerById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
