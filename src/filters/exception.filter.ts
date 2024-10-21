import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();

    // default to show general error message
    let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    const isHttpException: boolean = exception instanceof HttpException;
    if (isHttpException) {
      message = exception.getResponse().message ?? exception.message;
      httpStatus = exception.getStatus() ?? httpStatus;
    }

    const responseBody = {
      status: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
