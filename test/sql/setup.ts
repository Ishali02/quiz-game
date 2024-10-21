import { DataSource } from 'typeorm';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import * as crypto from 'node:crypto';
import { v4 } from 'uuid';
import { Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAttempt } from '../../src/db/entity/user-attempt.entity';
import { User } from '../../src/db/entity/user.entity';
import { Quiz } from '../../src/db/entity/quiz.entity';
import { Questions } from '../../src/db/entity/questions.entity';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../../src/filters/exception.filter';
import * as fs from 'fs';
const SQL_BASE_PATH = './test/sql/';
export const setUpDataSource = async (): Promise<DataSource> => {
  const db = newDb({ autoCreateForeignKeyIndices: true });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    implementation: () => crypto.randomUUID(),
    name: 'gen_random_uuid',
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });
  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgresSQL 14.2',
  });

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [__dirname + '../../src/**/*.entity{.ts,.js}'],
  });
  await ds.initialize();
  await ds.synchronize();

  await execSqlFromFile(SQL_BASE_PATH + 'clean-db.sql', db);
  await execSqlFromFile(SQL_BASE_PATH + 'init-db.sql', db);

  return ds;
};

export async function createTestingModuleWithInMemoryDB(
  optionalImports: Type[],
) {
  const dataSource = await setUpDataSource();
  return await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        entities: [UserAttempt, User, Quiz, Questions],
        synchronize: true,
      }),
      ...optionalImports,
    ],
    providers: [
      {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
      },
    ],
  })
    .overrideProvider(DataSource)
    .useValue(dataSource)
    .compile();
}

export async function execSqlFromFile(file: string, db: IMemoryDb) {
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter(Boolean);
  for (const line of lines) {
    if (line.length > 0 && !line.startsWith('--')) {
      db.public.query(line);
    }
  }
}
