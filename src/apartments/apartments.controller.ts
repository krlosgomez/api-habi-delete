import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Api } from 'src/shared/const';
import { UniqueId } from 'src/shared/validations/uniqueId';
import { ApartmentsService } from './apartments.service';
import { Apartment } from './entities/apartment.entity';

@ApiTags('Apartments')
@Controller(`${Api.apiPrefix}apartments`)
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) { }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.apartmentsService.delete(new UniqueId(id));
  }
}
