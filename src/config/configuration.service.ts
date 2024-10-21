import { Injectable } from '@nestjs/common';
import { AppConfig, IAppConfig } from './app/app.config';
import { DatabaseConfig, IDatabaseConfig } from './db/db.config';

@Injectable()
export class ConfigurationService {
  get app(): IAppConfig {
    return AppConfig.getConfig();
  }

  get database(): IDatabaseConfig {
    return DatabaseConfig.getConfig();
  }
}
