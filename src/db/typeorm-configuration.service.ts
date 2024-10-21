import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class TypeormConfigurationService implements TypeOrmOptionsFactory {
  constructor(private readonly configurationService: ConfigurationService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configurationService.database.host,
      port: this.configurationService.database.port,
      username: this.configurationService.database.username,
      password: this.configurationService.database.password,
      database: this.configurationService.database.name,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
      uuidExtension: 'pgcrypto',
    };
  }
}
