import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Model as AppModel } from '@herlinus/coloquent';
import { ReducerActions, ActionsContainer } from './base.entity.actions';
import { createReducer, on } from '@ngrx/store';
import { ProxyOneData, ProxyManyData } from './proxy';


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
        ),
        on(
            actions.removeOne,
            (state, { payload }) => {
                let id = payload.getApiId()
                return adapter.removeOne(id, state)
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
        ),
        on(
            ActionsContainer.getVarialbeAction().proxyOne,
            (state, { payload, variableName }) => {
                let _id = null
                if(payload) _id = payload.getApiId()
                state[variableName] = new ProxyOneData(_id)
                return state
            }
        ),
        on(
            ActionsContainer.getVarialbeAction().proxyMany,
            (state, { payload, variableName }) => {
                let data = []
                for (let obj of payload.getData()) {
                    data.push(obj.getApiId())
                }
                state[variableName] = new ProxyManyData(data)
                return state
            }
        )
    )
}

export class ReducerContainer {
    static reducers = {
        variables: variableReducer()
    }

    static addReducer(Target: typeof AppModel) {
        const genericAdapter: EntityAdapter<any> = createEntityAdapter({
            selectId: (entity:any) => { return entity.getApiId() }
        })
        let _type = Target.getJsonApiBaseType()
        ReducerContainer.reducers[_type] = entityReducer(genericAdapter, _type, ActionsContainer.getReducerAction(_type))
    }

    static getReducers() {
        return ReducerContainer.reducers
    }
}