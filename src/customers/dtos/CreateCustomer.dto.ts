import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from './CreateAddressDto.dto';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(1)
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
