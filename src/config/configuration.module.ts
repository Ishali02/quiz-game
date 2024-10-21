import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { appConfigValidationSchema } from './app/app.config';
import { databaseConfigValidationSchema } from './db/db.config';
import { ConfigurationService } from './configuration.service';
import * as process from 'node:process';
import { SwaggerSetupService } from '../swagger/swaggerSetup.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `envs/.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({})
        .concat(appConfigValidationSchema)
        .concat(databaseConfigValidationSchema),
    }),
  ],
  providers: [ConfigurationService, SwaggerSetupService],
  exports: [ConfigurationService, SwaggerSetupService],
})
export class ConfigurationModule {
  private readonly logger: Logger = new Logger(ConfigurationModule.name);

  constructor() {
    this.logger.log(`Loading configurations for:  ${process.env.NODE_ENV}`);
  }
}
