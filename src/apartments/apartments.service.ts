import { UniqueId } from './../shared/validations/uniqueId';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { Apartment } from './entities/apartment.entity';
import ValidationException from 'src/shared/validations/validationError';
import { OwnersService } from './infrastructure/owner/owners.service';

@Injectable()
export class ApartmentsService {

  constructor(
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
    private ownersService: OwnersService
  ) { }

  async delete(id: UniqueId) {
    const apartment: Apartment[] = await this.apartmentRepository.find({ where: { id: id.toString() }, loadRelationIds: true });
    if (apartment.length > 0) {
      await this.apartmentRepository.delete(id.toString());
      const apartmentsFound = await this.apartmentRepository.find({ where: { owner: apartment[0].owner } });
      if (apartmentsFound.length === 0 && apartment[0].owner) {
        await this.ownersService.delete(new UniqueId(apartment[0].owner));
      }
      return true;
    } else {
      throw new ValidationException("No existe el apartamento.")
    }
  }

}
