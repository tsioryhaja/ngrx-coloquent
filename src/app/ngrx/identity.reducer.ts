import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Identity } from '../models/identity';
import { entityReducer, ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';

export const identityReducerAdapter: EntityAdapter<Identity> = createEntityAdapter({
    selectId: (entity:Identity) => { return entity.getApiId() }
})

export const identityReducer = entityReducer(identityReducerAdapter, 'Identity', ActionsContainer.getReducerAction('Identity'))