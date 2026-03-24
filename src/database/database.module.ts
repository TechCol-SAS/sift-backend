import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities:
          configService.get<string>('NODE_ENV') === 'development'
            ? true
            : false,
        synchronize:
          configService.get<string>('NODE_ENV') === 'development'
            ? true
            : false,
        retryAttempts: 3,
        retryDelay: 5000,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
