import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Model as AppModel } from '@herlinus/coloquent';
import { ReducerActions, ActionsContainer } from './base.entity.actions';
import { createReducer, on } from '@ngrx/store';
import { ProxyOneData, ProxyManyData } from './proxy';


function updateStateObject (payload: any, state: any) {
    const payloadId = payload.getApiId();
    if (payloadId in state.entities) {
        const data = state.entities[payloadId];
        data.populateFromResource({id: payloadId, attributes: payload.getAttributes(), type: payload.getJsonApiType(), relationships: {}});
        const relations = data.getRelations();
        for (const relationName of relations) {
            const relation = payload.getRelation(relationName);
            if (relation) {
                data.setRelation(relationName, relation);
            }
        }
        payload = data;
    }
    return payload;
}


export function entityReducer(adapter: EntityAdapter<AppModel>, jsonApiType: string, actions: ReducerActions) {
    const initialState = adapter.getInitialState();
    const reducer = createReducer(
        initialState,
        on(
            actions.setOne,
            (state, { payload }) => {
                payload = updateStateObject(payload, state);
                return adapter.setOne(payload, state)
            }
        ),
        on(
            actions.setMany,
            (state, { payload }) => {
                //return adapter.updateMany(payload, state);
                for (let entity of payload) {
                    entity = updateStateObject(entity, state);
                    state = adapter.setOne(entity, state);
                }
                return state;
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
    return reducer;
}

export function variableReducer() {
    const initialState = {}
    const reducer = createReducer(
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
                state[variableName] = new ProxyOneData(_id, payload.getJsonApiBaseType());
                return state
            }
        ),
        on(
            ActionsContainer.getVarialbeAction().proxyMany,
            (state, { payload, variableName }) => {
                let data = payload;
                state[variableName] = new ProxyManyData(data);
                return state
            }
        )
    )
    return reducer
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