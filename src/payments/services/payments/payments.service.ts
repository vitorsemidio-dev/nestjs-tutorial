import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payments/dtos/CreatePayment.dto';

@Injectable()
export class PaymentsService {
  private users = [
    {
      email: 'user1@email.com',
    },
    {
      email: 'user2@email.com',
    },
    {
      email: 'user3@email.com',
    },
  ];

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { email } = createPaymentDto;
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      id: 1,
      status: 'success',
    };
  }
}
