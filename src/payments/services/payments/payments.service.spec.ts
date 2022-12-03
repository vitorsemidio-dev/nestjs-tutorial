import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from 'src/payments/services/payments/payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it(`should return status "success" in response`, async () => {
      const output = await service.createPayment({
        email: 'user1@email.com',
        price: 100,
      });
      expect(output).toMatchObject({
        status: 'success',
      });
    });

    it('should return id as number in response', async () => {
      const output = await service.createPayment({
        email: 'user1@email.com',
        price: 100,
      });
      expect(output).toMatchObject({
        id: expect.any(Number),
      });
    });

    it(`should throw BadRequestException('User not found') if user not found`, async () => {
      const outputPromise = service.createPayment({
        email: 'user_not_found_email@email.com',
        price: 100,
      });
      expect(outputPromise).rejects.toThrow(
        new BadRequestException('User not found'),
      );
    });
  });
});
