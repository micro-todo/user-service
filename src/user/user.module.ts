import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'NOTIFICATIONS_SERVICE',
        useFactory: (configService: ConfigService<AppConfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('rmqUrl')],
            queue: configService.get<string>('rmqNotificationsQueue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'TASKS_SERVICE',
        useFactory: (configService: ConfigService<AppConfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('rmqUrl')],
            queue: configService.get<string>('rmqTasksQueue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
