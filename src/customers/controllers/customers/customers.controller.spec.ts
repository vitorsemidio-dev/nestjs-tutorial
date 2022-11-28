import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';

const CUSTOMERS_SERVICE_TOKEN = 'CUSTOMERS_SERVICE';

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CUSTOMERS_SERVICE_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
