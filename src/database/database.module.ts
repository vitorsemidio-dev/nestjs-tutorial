import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { isTrueText } from 'src/helpers/boolean.helper';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      autoLoadEntities: true,
      database: process.env.TYPEORM_DATABASE,
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
      dropSchema: isTrueText(process.env.TYPEORM_DROP_SCHEMA),
    }),
  ],
})
export class DatabaseModule {}
