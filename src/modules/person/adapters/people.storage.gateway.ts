import { ResponseApi } from "@/kernel/types";
import { Person } from "../entities/person";
import { PersonRepository } from "../use-cases/ports/person.repository";
import { SavePersonDto } from "./dto/save-person";
import { UpdatePersonDto } from "./dto/update-person";

export class PersonStorageGateway implements PersonRepository {
    getError(): ResponseApi<Person> {
        return {
            code: 500,
            error: true,
            message: 'INTERNAL ERROR SERVER'
        } as ResponseApi<Person>;
    }

    async findAll(): Promise<ResponseApi<Person>> {
        return await fetch(`http://localhost:3000/user/`).then(data => data.json())
        .then(({entities}) => {
            return {
                code: 200,
                message: 'OK',
                entities: entities,
                count: entities.length
            } as ResponseApi<Person>;
        }).catch(() => this.getError());
    }

    
    async findPerson(payload: number): Promise<ResponseApi<Person>> {
        return await fetch(`http://localhost:3000/user/${payload}`).then(data => data.json())
        .then(({entity}) => {
            return {
                code: 200,
                error: false,
                message: 'OK',
                entity: entity
            } as ResponseApi<Person>;
        }).catch(() => this.getError());
    }
    async savePerson(payload: SavePersonDto): Promise<ResponseApi<Person>> {
        return await fetch('http://localhost:3000/user/', {
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => data.json()).then(() => {
            return {
                code: 200,
                error: false,
                message: 'PERSON REGISTERED'
            } as ResponseApi<Person>;
        }).catch(() => this.getError());
    }
    async updatePerson(payload: UpdatePersonDto): Promise<ResponseApi<Person>> {
        return await fetch(`http://localhost:3000/user/${payload.id}`, {
            method: 'PUT', 
            body: JSON.stringify(payload), 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => data.json()).then(() => {
            return {
                code: 200,
                error: false,
                message: "PERSON UPDATED"
            } as ResponseApi<Person>;
        }).catch(() => this.getError());
    }

    async deletePerson(payload: number): Promise<ResponseApi<Person>> {
        console.log(payload);
        return await fetch (`http://localhost:3000/user/${payload}`,{
            method: 'DELETE'
        }).then(data => data.json()).then(({entity})=>{
            return{
                    code: 200,
                    error: false,
                    entity: entity,
                    message: "PERSON DELETED"
            }as ResponseApi<Person>;
        }).catch(() => this.getError())
    }
}