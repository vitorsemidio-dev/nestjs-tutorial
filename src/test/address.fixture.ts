import { CreateAddressDto } from 'src/customers/dtos/CreateAddressDto.dto';
import { fakerPtBr } from 'src/test/faker-pt-br.utils';

const { address } = fakerPtBr;

export function createAddressDtoFactory(): CreateAddressDto {
  const state = address.state();
  const plainValue = {
    line1: address.streetAddress(),
    line2: address.streetAddress(),
    city: address.cityName(),
    state: state,
    zip: address.zipCodeByState(state),
  };
  const createAddressDto = Object.assign(new CreateAddressDto(), plainValue);
  return createAddressDto;
}
