import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Routes } from '../shared/constants';

@Injectable()
export class SwaggerSetupService {
  private readonly logger: Logger = new Logger(SwaggerSetupService.name);

  public setSwagger(app: INestApplication): void {
    this.logger.log('Building Swagger Configuration');
    const options = new DocumentBuilder()
      .setTitle('Quiz')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${Routes.SERVICE_PREFIX}/api-docs`, app, document);
  }
}
