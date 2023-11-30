import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Jwt } from '../guards';

import { SivepService } from './sivep.service';

import { ListViewsResponseDto } from './dto';

import 'multer';

@Controller()
@ApiTags('sivep')
export class SivepController {
  constructor(private readonly sivepService: SivepService) {}

  @Jwt()
  @Post('upload/:year')
  @ApiOperation({
    summary: 'Upload (post a csv file)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('year') year: number,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.sivepService.uploadFile({ year, file });
  }

  @Get('fetch/:view')
  @ApiOperation({
    summary: 'Fetch data from a view',
  })
  async fetchData(@Param('view') view: string) {
    return this.sivepService.fetchData(view);
  }

  @Get('views')
  @ApiOperation({
    summary: 'List all view names',
  })
  @ApiResponse({
    type: [ListViewsResponseDto],
  })
  async listViews(): Promise<ListViewsResponseDto[]> {
    return this.sivepService.listViews();
  }

  @Jwt()
  @Delete('clear')
  @ApiOperation({
    summary: 'Clear all data',
  })
  async clear() {
    return this.sivepService.clear();
  }
}
