import { ApiProperty } from '@nestjs/swagger';

export class ListViewsResponseDto {
  @ApiProperty({
    description: 'View endpoint',
    example: 'notif',
  })
  endpoint: string;

  @ApiProperty({
    description: 'View description',
    example: 'Lorem ipsum',
  })
  description: string;

  @ApiProperty({
    description: 'View name',
    example: 'SerieHistNotif',
  })
  name: string;
}
