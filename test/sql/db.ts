'use strict';

import { Pool } from 'pg';
import * as fs from 'fs';

const db = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const execSqlFromFile = async (file: string) => {
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter(Boolean);
  for (const line of lines) {
    if (line.length > 0 && !line.startsWith('--')) {
      await db.query(line).catch((e) => {
        console.error(
          `SQL Error file: ${file} line ${lines.indexOf(line) + 1}: ${e}`,
        );
      });
    }
  }
};

export const resetDatabase = async () => {
  await execSqlFromFile('./test/sql/clean-db.sql');
  await execSqlFromFile('./test/sql/init-db.sql');
};

export const closeConnection = () => db.end();
