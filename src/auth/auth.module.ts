import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { DatabaseModule } from '../db/database.module';
import { ConfigurationService } from '../config/configuration.service';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => ({
        secret: configService.app.jwtSecret, // Load secret from environment
        signOptions: { expiresIn: '1h' }, // Token expiration time
      }),
      inject: [ConfigurationService],
    }),
    DatabaseModule,
  ],
  providers: [AuthService, JwtStrategy, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
