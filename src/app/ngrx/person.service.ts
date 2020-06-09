import { Injectable } from '@angular/core';
import { BaseJsonAPIService } from 'projects/ngrx-coloquent/src/public-api';
import { Person } from '../models/person';

@Injectable({
    providedIn: 'root'
})
export class PersonService extends BaseJsonAPIService<Person> {
    resource = Person
    resourceType = 'Person'
}