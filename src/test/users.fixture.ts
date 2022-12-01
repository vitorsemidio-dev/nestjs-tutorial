import { faker } from '@faker-js/faker';
import { User } from 'src/users/entities/User.entity';

export const usersFixture: User[] = [
  {
    id: 1,
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
  },
  {
    id: 2,
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
  },
];
