import { Injectable, Logger } from '@nestjs/common';

import { Client } from 'pg';

import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationsService {
  public client: Client;
  private logger = new Logger(MigrationsService.name);
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    this.client.connect().then(
      () => this.logger.log('Connected to database successfully'),
      (error) => this.logger.error('Error connecting to database:', error),
    );
  }

  async runScript(name: string) {
    const sql = readFileSync(path.resolve(__dirname, 'sql', name), 'utf8');
    return this.client.query(sql);
  }

  async createSivepTable() {
    await this.runScript('sivep.sql');
  }

  async createUsersTable() {
    await this.runScript('users.sql');
  }

  async createViews() {
    await this.runScript('views.sql');
    await this.runScript('refresh-views.sql');
    await this.refreshViews();
  }

  async createTempTable(year: number) {
    await this.client.query(`
      CREATE TABLE "Temporary_${year}" (
        LIKE "Sivep"
        INCLUDING defaults
        INCLUDING constraints
        INCLUDING indexes
      );
    `);

    await this.client.query(`
      COPY "Temporary_${year}"
      FROM '/var/lib/postgresql/data/dataset.csv'
      DELIMITER ',' CSV HEADER;
    `);
  }

  async dropTempTable(year: number) {
    await this.client.query(`DROP TABLE IF EXISTS "Temporary_${year}";`);
  }

  async replacePartition(year: number) {
    try {
      await this.client.query(`
        ALTER TABLE "Sivep"
        DETACH PARTITION "Sivep_${year}";
      `);
    } catch (e) {} // Partition doesn't exist, ignore

    try {
      await this.client.query(`DROP TABLE "Sivep_${year}";`);
    } catch (e) {} // Table doesn't exist, ignore

    await this.client.query(`
      ALTER TABLE "Temporary_${year}"
      RENAME TO "Sivep_${year}";
    `);

    await this.client.query(`
      ALTER TABLE "Sivep"
      ATTACH PARTITION "Sivep_${year}" FOR VALUES IN (${year});
    `);

    await this.refreshViews();
  }

  async selectView(view: string) {
    return this.client.query(`SELECT * FROM "${view}";`);
  }

  async refreshViews() {
    await this.client.query(`SELECT "RefreshAllMaterializedViews"('public');`);
  }

  async clearTable() {
    await this.client.query(`TRUNCATE TABLE "Sivep" CASCADE;`);
  }
}
