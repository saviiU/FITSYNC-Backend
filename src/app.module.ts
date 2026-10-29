import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        host: c.get('DB_HOST'),
        port: Number(c.get('DB_PORT')),
        username: c.get('DB_USER'),
        password: c.get('DB_PASS'),
        database: c.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: c.get('NODE_ENV') !== 'production',
        ssl: c.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    UsersModule,
    // Each owner adds their module here, e.g. AuthModule, BookingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}