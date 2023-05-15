import { PersonRepository } from './ports/person.repository';
import { Person } from './../entities/person';
import { ResponseApi } from './../../../kernel/types';
import { UseCase } from './../../../kernel/contacts';

export class DeletePersonInteractor implements UseCase<number, ResponseApi<Person>>{
    constructor(private readonly personRepository:PersonRepository){}

    execute(payload: number): Promise<ResponseApi<Person>> {
        return this.personRepository.deletePerson(payload);
    }
}