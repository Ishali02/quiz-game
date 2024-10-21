import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

export interface IDatabaseConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  name: string;
}

export const databaseConfigValidationSchema: ObjectSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().min(1024).max(49151).optional(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});

export class DatabaseConfig {
  private static config: IDatabaseConfig | undefined = undefined;

  static getConfig(): IDatabaseConfig {
    if (!DatabaseConfig.config) {
      const defaultDbPort = 5432;
      const portStr: string | undefined = process.env.DB_PORT;
      const port: number = portStr ? parseInt(portStr, 10) : defaultDbPort;
      DatabaseConfig.config = {
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        host: process.env.DB_HOST as string,
        port: port,
        name: process.env.DB_NAME as string,
      };
    }
    return DatabaseConfig.config;
  }
}
