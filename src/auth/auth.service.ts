import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { UserRequest } from './dto/user-request.dto';
import { User } from '../db/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.create({
      username,
      password: hashedPassword,
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { id, username } = user; // Exclude password from result
      return { id, username };
    }
    return null;
  }

  async login(userReq: UserRequest) {
    const user = await this.validateUser(userReq.username, userReq.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
