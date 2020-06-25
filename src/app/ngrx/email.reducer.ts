import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Email } from '../models/emails';
import { entityReducer, ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';

export const emailReducerAdapter: EntityAdapter<Email> = createEntityAdapter({
    selectId: (entity: Email) => {
        console.log(entity)
        return entity.getApiId()
    }
})

export const emailReducer = entityReducer(emailReducerAdapter, 'Email', ActionsContainer.getReducerAction('Email'))