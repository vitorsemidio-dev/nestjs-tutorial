import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

const HASH_SERVICE_TOKEN = 'HASH_SERVICE';
const USER_SERVICE_TOKEN = 'USER_SERVICE';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HASH_SERVICE_TOKEN,
          useValue: {},
        },
        {
          provide: USER_SERVICE_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
