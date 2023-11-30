import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UploadDto {
  @ApiProperty({
    description: 'The year of the csv file',
    example: 2018,
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'The csv file',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}
