import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      autoLoadEntities: true,
      database: './db/database.sqlite',
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
