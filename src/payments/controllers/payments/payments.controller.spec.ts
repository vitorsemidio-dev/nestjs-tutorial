import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { PaymentsService } from 'src/payments/services/payments/payments.service';
import { PaymentsController } from './payments.controller';

const makeMock = () => {
  const requestMock = {
    query: {},
  } as unknown as Request;
  const sendMockFn = {
    send: jest.fn((x) => x),
  };
  const responseMock = {
    status: jest.fn((x) => sendMockFn),
    send: jest.fn((x) => x),
  } as unknown as Response;

  return {
    requestMock,
    responseMock,
    sendMockFn,
  };
};

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: 'PAYMENT_SERVICE',
          useValue: {
            createPayment: jest.fn((x) => ({
              status: 'success',
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>('PAYMENT_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('paymentsService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPayments', () => {
    it('should return a status of 400 when query params are not provided', () => {
      const { requestMock, responseMock, sendMockFn } = makeMock();
      controller.getPayments(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(sendMockFn.send).toHaveBeenCalledWith({
        msg: 'Missing count or page query parameter',
      });
    });
    it('should return a status of 400 when page is not provided', () => {
      const { requestMock, responseMock, sendMockFn } = makeMock();
      requestMock.query = {
        count: '1',
      };

      controller.getPayments(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(sendMockFn.send).toHaveBeenCalledWith({
        msg: 'Missing count or page query parameter',
      });
    });

    it('should return a status of 400 when count not provided', () => {
      const { requestMock, responseMock, sendMockFn } = makeMock();
      requestMock.query = {
        page: '1',
      };
      controller.getPayments(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(sendMockFn.send).toHaveBeenCalledWith({
        msg: 'Missing count or page query parameter',
      });
    });

    it('should return a status of 200 when query params are provided', () => {
      const { requestMock, responseMock } = makeMock();
      requestMock.query = {
        count: '1',
        page: '1',
      };
      controller.getPayments(requestMock, responseMock);
      expect(responseMock.send).toHaveBeenCalledWith(200);
    });
  });

  describe('createPayment', () => {
    it('should return a success response', async () => {
      const output = await controller.createPayment({
        email: 'user1@email.com',
        price: 100,
      });
      expect(output).toStrictEqual({ status: 'success' });
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(service, 'createPayment').mockImplementationOnce(() => {
        throw new BadRequestException('User not found');
      });
      const outputPromise = controller.createPayment({
        email: 'user1@email.com',
        price: 100,
      });
      expect(outputPromise).rejects.toThrow(
        new BadRequestException('User not found'),
      );
    });
  });
});
