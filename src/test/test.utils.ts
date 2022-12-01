import { User } from 'src/users/entities/User.entity';
import { DataSource } from 'typeorm';

export const allEntities = [User];
export const testConnectionName = 'testConnection';
export const appDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: allEntities,
  logging: false,
  name: testConnectionName,
});
