import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { decode } from 'jsonwebtoken';

export enum Routes {
  SERVICE_PREFIX = 'quiz-game',
}

export type Answer = { questionId: string; answer: number };

const logger = new Logger();
export const getUserIdFromHeaders = createParamDecorator(
  (dta: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers?.authorization;
    if (!token) {
      logger.error('Authorization header is missing');
      throw new UnauthorizedException();
    }
    const decodedToken = decode(token.substring(7));
    return decodedToken.sub;
  },
);
