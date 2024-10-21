import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import * as process from 'node:process';

export interface IAppConfig {
  environment: string;
  port: number;
  swaggerEnabled: boolean;
}

export const appConfigValidationSchema: ObjectSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().integer().min(1024).max(49151).optional(),
  SWAGGER_ENABLED: Joi.boolean().optional(),
});

export class AppConfig {
  private static _config: IAppConfig | undefined = undefined;

  static getConfig(): IAppConfig {
    const defaultPort = 8080;

    if (!AppConfig._config) {
      const portStr: string | undefined = process.env.PORT;
      const port: number = portStr ? parseInt(portStr, 10) : defaultPort;

      AppConfig._config = {
        environment: process.env.NODE_ENV as string,
        port: port,
        swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
      };
    }
    return AppConfig._config;
  }
}
