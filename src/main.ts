import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IAppConfig } from './config/app/app.config';
import { ConfigurationService } from './config/configuration.service';
import { SwaggerSetupService } from './swagger/swaggerSetup.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const appConfig: IAppConfig =
    app.get<ConfigurationService>(ConfigurationService).app;
  if (appConfig.swaggerEnabled)
    app.get<SwaggerSetupService>(SwaggerSetupService).setSwagger(app);
  app.enableCors();
  await app.listen(appConfig.port);
}
bootstrap();
