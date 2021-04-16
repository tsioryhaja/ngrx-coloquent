import { Model } from "@herlinus/coloquent";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { reducerFirstInit, reducerRemoveOne, reducerSetMany, reducersSetOne } from "./global-reducers.actions";

export interface GlobalEntityState {
    [name: string]: EntityState<Model>;
}

const GlobalEntityAdapter: EntityAdapter<Model> = createEntityAdapter({
    selectId: (entity: Model) => entity.getApiId()
});

function repopulateAttributes(baseData: Model, payload: Model) {
    const obj = {
        id: "" + payload.getApiId(),
        attributes: payload.getAttributes(),
        type: payload.getJsonApiType(),
        relationships: payload.getRelations()
    };
    baseData.populateFromResource(
        obj
    );
    return baseData;
}

function repopulateRelations(baseData: Model, payload: Model) {
    const relations = payload.getRelations();
    for (const relationName of Object.keys(relations)) {
        const relation = payload.getRelation(relationName);
        relation ? baseData.setRelation(relationName, relation) : null;
    }
    return baseData;
}

function oneReducer(data: Model, state: GlobalEntityState): GlobalEntityState {
    const jsonapiType = data.getJsonApiBaseType();
    let objectState = state[jsonapiType];
    objectState = objectState ? objectState : GlobalEntityAdapter.getInitialState();
    let payload = objectState.entities[data.getApiId()];
    payload = payload ? payload : data;
    payload = repopulateAttributes(payload, data);
    payload = repopulateRelations(payload, data);
    objectState = GlobalEntityAdapter.setOne(payload, objectState);
    state[jsonapiType] = objectState;
    return { ...state };
}

function manyReducer(payloads: Model[], state: GlobalEntityState) {
    for (let payload of payloads) {
        state = oneReducer(payload, state);
    }
    return { ...state };
}

function removeOneReducer(data: Model, state: GlobalEntityState): GlobalEntityState {
    const jsonapiType = data.getJsonApiBaseType();
    let objectState = state[jsonapiType];
    objectState = GlobalEntityAdapter.removeOne(data.getApiId(), objectState);
    state[jsonapiType] = objectState;
    return { ...state };
}

function firstInitReducer(entityStateKeys: string[], state: GlobalEntityState): GlobalEntityState {
    for (const jsonapiType of entityStateKeys) {
        state[jsonapiType] = GlobalEntityAdapter.getInitialState();
    }
    return { ...state };
}

const _globaEntityReducer = createReducer(
    {},
    on(reducersSetOne, (state, { payload }) => oneReducer(payload, state)),
    on(reducerSetMany, (state, { payloads }) => manyReducer(payloads, state)),
    on(reducerRemoveOne, (state, { payload }) => removeOneReducer(payload, state)),
    on(reducerFirstInit, (state, { entityStateKeys }) => firstInitReducer(entityStateKeys, state))
);

export function GlobalEntityReducer(state: GlobalEntityState | undefined, action: Action) {
    return _globaEntityReducer(state, action);
}