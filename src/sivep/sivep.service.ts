import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { MigrationsService } from './migrations.service';

import { Views } from '../constants';
import { UploadDto, ListViewsResponseDto } from './dto';

import { unlinkSync, writeFileSync } from 'fs';

import { json2csv } from 'json-2-csv';
import { ProfilerService } from 'src/profiler/profiler.service';

@Injectable()
export class SivepService {
  private logger = new Logger(MigrationsService.name);
  constructor(
    private readonly migrations: MigrationsService,
    private readonly profiler: ProfilerService,
  ) {
    this.initTables();
  }

  async initTables() {
    await this.migrations.createUsersTable();
    await this.migrations.createSivepTable();
    await this.migrations.createViews();
  }

  async uploadFile(uploadDto: UploadDto) {
    if (uploadDto.file.mimetype !== 'text/csv') {
      throw new BadRequestException('Not a CSV file');
    }

    this.profiler.start('Read file buffer', 'uploadFile');
    const buffStr = uploadDto.file.buffer.toString();
    this.profiler.end();

    if (buffStr.trim().length === 0) {
      throw new BadRequestException('Empty CSV file');
    }

    this.profiler.start('Ensure header validity', 'uploadFile');
    const header = buffStr
      .split('\n')
      .filter((ln) => ln.trim().length > 0)[0]
      .replace('ï»¿', '')
      .toLocaleLowerCase()
      .split(',');
    const expectedHeader =
      'uid,ano,cod_noti,dt_notif,dt_envlo,dt_digit,sem_noti,tipo_lam,uf_notif,mun_noti,cod_unin,cod_agen,dt_nasci,id_pacie,id_dimea,sexo,raca,pais_res,uf_resid,mun_resi,loc_resi,sintomas,dt_sinto,cod_ocup,uf_infec,pais_inf,mun_infe,loc_infe,dt_exame,res_exam,qtd_para,qtd_cruz,dt_trata,esquema,hemoparasi,exame,examinador,id_lvc,gestante,vivax,falciparum,niv_esco,id_pacie_anos,nu_predi_infe,nu_habit_infe,zona_infe,categori_infe,nu_predi_resi,nu_habit_resi,zona_resi,categori_resi'.split(
        ',',
      );

    const matchingHeaders =
      header.every((h) => expectedHeader.includes(h)) &&
      expectedHeader.every((h) => header.includes(h));

    if (!matchingHeaders) {
      throw new BadRequestException('Invalid CSV file');
    }
    this.profiler.end();

    try {
      this.profiler.start('Write file to Postgres volume', 'uploadFile');
      writeFileSync('data/postgres/dataset.csv', buffStr, 'utf-8');
      this.profiler.end();

      this.profiler.start('Create temp table', 'uploadFile');
      await this.migrations.createTempTable(uploadDto.year);
      this.profiler.end();
      this.profiler.start('Replace partition', 'uploadFile');
      await this.migrations.replacePartition(uploadDto.year);
      this.profiler.end();
    } catch (e) {
      this.profiler.start('Drop temp table', 'uploadFile');
      await this.migrations.dropTempTable(uploadDto.year);
      this.profiler.end();
      this.logger.error(e.stack);
      throw new InternalServerErrorException(
        'An error has ocurred: ' + e.toString(),
      );
    } finally {
      this.profiler.start('Delete CSV', 'uploadFile');
      unlinkSync('data/postgres/dataset.csv');
      this.profiler.end();
    }
  }

  async fetchData(view: string) {
    if (!(view in Views)) {
      throw new NotFoundException('View not found');
    }

    const q = await this.migrations.selectView(Views[view].name);
    if (!q || !q.rows) {
      throw new InternalServerErrorException();
    }

    const headers = q.fields.map((field) => field.name);

    if (!q.rows.length) {
      return headers.join(',');
    }

    return json2csv(q.rows, {
      keys: headers,
    });
  }

  async listViews(): Promise<ListViewsResponseDto[]> {
    const response: ListViewsResponseDto[] = [];
    for (const view in Views) {
      response.push({
        endpoint: view,
        description: Views[view].description,
        name: Views[view].name,
      });
    }
    return response;
  }

  async clear() {
    await this.migrations.clearTable();
    await this.migrations.refreshViews();
  }
}
