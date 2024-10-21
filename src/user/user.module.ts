import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule],
})
export class UserModule {}
