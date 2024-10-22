import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NumberAllowedValidator } from './validator/number-allowed.validator';

@Module({
  controllers: [UserController],
  providers: [UserService, NumberAllowedValidator],
  imports: [DatabaseModule],
})
export class UserModule {}
