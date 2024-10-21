import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRequest } from './dto/user-request.dto';
import { Routes } from '../shared/constants';

@ApiTags('Auth')
@Controller(`${Routes.SERVICE_PREFIX}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: UserRequest) {
    return this.authService.register(body.username, body.password);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserRequest) {
    return this.authService.login(body);
  }
}
