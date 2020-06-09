import { BaseEffects } from 'projects/ngrx-coloquent/src/public-api';
import { CollaboratorService } from './collaborator.service';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Collaborator } from '../models/collaborator';
import { Injectable } from '@angular/core';

@Injectable()
export class CollaboratorEffects extends BaseEffects {
    constructor(service: CollaboratorService, actions$: Actions, store: Store<Collaborator>) {
        super(service, actions$, store)
    }
}