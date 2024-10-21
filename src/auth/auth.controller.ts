import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserRequest } from './dto/user-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: UserRequest) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: UserRequest) {
    return this.authService.login(body);
  }
}
