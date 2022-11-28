import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import * as bcrypt from 'bcrypt';

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a payload', () => {
    const salt = bcrypt.genSaltSync();
    jest.spyOn(bcrypt, 'genSaltSync').mockReturnValueOnce(salt);
    jest.spyOn(bcrypt, 'hashSync');
    const input = 'payload';
    service.hash(input);
    expect(bcrypt.genSaltSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(input, salt);
  });

  it('should compare a payload and a hash', () => {
    jest.spyOn(bcrypt, 'compareSync');
    const input = 'payload';
    const hash = service.hash(input);
    const output = service.compare(input, hash);
    expect(output).toBe(true);
    expect(bcrypt.compareSync).toHaveBeenCalledWith(input, hash);
  });

  it('should compare and return false if invalid payload is provided', () => {
    jest.spyOn(bcrypt, 'compareSync');
    const input = 'payload';
    const hash = service.hash(input);
    const output = service.compare('incorrect_payload', hash);
    expect(output).toBe(false);
    expect(bcrypt.compareSync).toHaveBeenCalledWith('incorrect_payload', hash);
  });
});
