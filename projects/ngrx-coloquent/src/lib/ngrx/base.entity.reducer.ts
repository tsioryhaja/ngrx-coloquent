import { EntityAdapter } from '@ngrx/entity';
import { Model as AppModel } from '@herlinus/coloquent';
import { ReducerActions, ActionsContainer } from './base.entity.actions';
import { createReducer, on } from '@ngrx/store';


export function entityReducer(adapter: EntityAdapter<AppModel>, jsonApiType: string, actions: ReducerActions) {
    const initialState = adapter.getInitialState();
    return createReducer(
        initialState,
        on(
            actions.setOne,
            (state, { payload }) => {
                return adapter.setOne(payload, state)
            }
        ),
        on(
            actions.setMany,
            (state, { payload }) => {
                return adapter.setAll(payload, state)
            }
        )
    )
}

export function variableReducer() {
    const initialState = {}
    return createReducer(
        initialState,
        on(
            ActionsContainer.getVarialbeAction().set,
            (state, { payload, variableName }) => {
                state[variableName] = payload
                return state
            }
        )
    )
}