import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerDto } from 'src/customers/dtos/CreateCustomer.dto';
import { createAddressDtoFactory } from 'src/test/address.fixture';
import { customerFactory } from 'src/test/customers.fixture';
import { CustomersService } from './customers.service';

const makeSut = () => {
  const customer = customerFactory();
  const address = createAddressDtoFactory();
  const createCustomerDto: CreateCustomerDto = {
    address: address,
    email: customer.email,
    id: customer.id,
    name: customer.name,
  };

  return { createCustomerDto };
};

describe(`${CustomersService.name}`, () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`${CustomersService.prototype.createCustomer.name}`, () => {
    it('should create a new customers with all fields provided', async () => {
      const { createCustomerDto: input } = makeSut();
      const expected = input;
      const output = await service.createCustomer(input);
      expect(output).toEqual(expected);
    });

    it('should create a new customers without optional fields', async () => {
      const { createCustomerDto: input } = makeSut();
      const expected = undefined;
      input.address.line2 = undefined;
      const output = await service.createCustomer(input);
      expect(output.address.line2).toEqual(expected);
    });

    it('should return id as a number when create a new user', async () => {
      const { createCustomerDto: input } = makeSut();
      const expected = expect.objectContaining({
        id: expect.any(Number),
      });
      const output = await service.createCustomer(input);
      expect(output).toEqual(expected);
    });

    it('should storage the new user', async () => {
      const { createCustomerDto: input } = makeSut();
      await service.createCustomer(input);
      const output = await service.findCustomerById(input.id);
      const expected = input;
      expect(output).toEqual(expected);
    });
  });

  describe(`${CustomersService.prototype.findCustomerById.name}`, () => {
    it('should return user by id', async () => {
      const { createCustomerDto: input } = makeSut();
      const expected = input;
      await service.createCustomer(input);
      const output = await service.findCustomerById(input.id);
      expect(output).toEqual(expected);
    });

    it('should return undefined when user is not found', async () => {
      // Arrange
      const input = 987654;
      // Act
      const output = await service.findCustomerById(input);
      // Assert
      const expected = undefined;
      expect(output).toEqual(expected);
    });
  });

  describe(`${CustomersService.prototype.findAllCustomers.name}`, () => {
    it('should return a array', async () => {
      const output = service.findAllCustomers();
      expect(output).toBeInstanceOf(Array);
    });

    it('should return a array with new customer', async () => {
      // Arrange
      const { createCustomerDto: input } = makeSut();
      await service.createCustomer(input);
      // Act
      const output = service.findAllCustomers();
      // Assert
      const expected = input;
      expect(output).toContainEqual(expected);
      expect(output).toEqual(expect.arrayContaining([expected]));
      expect(output).toEqual(expect.arrayContaining([input]));
      expect(output).toEqual(expect.arrayContaining([expect.any(Object)]));
      expect(output).toEqual(expect.arrayContaining([expect.anything()]));
    });

    it('should return new item created in the array', async () => {
      // Arrange
      const { createCustomerDto: input } = makeSut();
      await service.createCustomer(input);
      // Act
      const output = service.findAllCustomers();
      // Assert
      const expected = input;
      expect(output.find((x) => x.id === input.id)).toEqual(expected);
    });
  });
});
