import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigurationService } from './db/typeorm-configuration.service';
import { DatabaseModule } from './db/database.module';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/exception.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useClass: TypeormConfigurationService,
    }),
    DatabaseModule,
    QuizModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
