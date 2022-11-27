import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/User.entity';

type SerializedUserDtoProps = { password: string & Partial<User> };

export class SerializedUserDto {
  @Exclude()
  password: string;

  constructor(partial: SerializedUserDtoProps) {
    Object.assign(this, partial);
  }
}
