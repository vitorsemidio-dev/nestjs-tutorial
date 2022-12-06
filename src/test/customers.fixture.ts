import { Customer } from 'src/customers/types/Customer';
import { fakerPtBr } from 'src/test/faker-pt-br.utils';

export function customerFactory(): Customer {
  const name = fakerPtBr.name.fullName();
  const plainValue = {
    email: fakerPtBr.internet.email(name),
    id: fakerPtBr.datatype.number({ min: 1, max: 10000 }),
    name: name,
  };
  const customer = Object.assign(new Customer(), plainValue);
  return customer;
}
