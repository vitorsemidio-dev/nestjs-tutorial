import { fakerPtBr } from 'src/test/faker-pt-br.utils';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/entities/User.entity';

export function userFactory(): User {
  return {
    id: fakerPtBr.datatype.number({ min: 1, max: 10000 }),
    email: fakerPtBr.internet.email(),
    password: fakerPtBr.internet.password(),
    username: fakerPtBr.internet.userName(),
  };
}

export function userManyFactory(quantity: number): User[] {
  const minValue = 0;
  if (quantity < minValue) {
    throw new Error(`'quantity' must be greater than ${minValue}`);
  }
  return Array.from({ length: quantity }).map(() => userFactory());
}

export const usersFixture: User[] = [userFactory(), userFactory()];

export function createUserDtoFactory(): CreateUserDto {
  return {
    email: fakerPtBr.internet.email(),
    password: fakerPtBr.internet.password(),
    username: fakerPtBr.internet.userName(),
  };
}

export function createUserDtoManyFactory(quantity: number): CreateUserDto[] {
  const minValue = 0;
  if (quantity < minValue) {
    throw new Error(`'quantity' must be greater than ${minValue}`);
  }
  return Array.from({ length: quantity }).map(() => createUserDtoFactory());
}
