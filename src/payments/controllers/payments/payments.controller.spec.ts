import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
});
