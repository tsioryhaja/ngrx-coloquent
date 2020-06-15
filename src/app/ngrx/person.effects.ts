import { Injectable } from "@angular/core";
import { BaseEffects, ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';
import { PersonService } from './person.service';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Person } from '../models/person';

@Injectable()
export class PersonEffects extends BaseEffects {
    constructor(service: PersonService, actions$: Actions, store: Store<Person>){
        super(service, actions$, store)
    }
}