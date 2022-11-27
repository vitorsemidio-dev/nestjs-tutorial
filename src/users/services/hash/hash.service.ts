import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  hash(payload: string): string {
    const salt = bcrypt.genSaltSync();
    const passwordHashed = bcrypt.hashSync(payload, salt);
    return passwordHashed;
  }

  compare(rawPayload: string, hash: string): boolean {
    const isValid = bcrypt.compareSync(rawPayload, hash);
    return isValid;
  }
}
