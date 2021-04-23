import { Model } from "@herlinus/coloquent";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { reducerFirstInit, reducerRemoveOne, reducerSetMany, reducersSetOne, reducersSetRelation } from "./global-reducers.actions";

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

function repopulateRelations(baseData: Model, payload: Model, state: GlobalEntityState) {
    const relations = payload.getRelations();
    for (const relationName of Object.keys(relations)) {
        const relation = payload.getRelation(relationName);
        if (relation) {
            if (Array.isArray(relation)) {
                populateRelationArray(state, baseData, relation, relationName);
            } else {
                populateRelationOne(state, baseData, relation, relationName);
            }
        }
    }
    return baseData;
}

function populateRelationArray(state: GlobalEntityState, baseData: Model, relations: Model[], relationName: string) {
    relations = relations.map(
        (value: Model) => getObjectFromStore(state, value)
    );
    baseData.setRelation(relationName, relations);
}

function populateRelationOne(state: GlobalEntityState, baseData: Model, relation: Model, relationName: string) {
    relation = getObjectFromStore(state, relation);
    baseData.setRelation(relationName, relation);
}

function oneReducer(data: Model, state: GlobalEntityState): GlobalEntityState {
    const jsonapiType = data.getJsonApiBaseType();
    let objectState = state[jsonapiType];
    objectState = objectState ? objectState : GlobalEntityAdapter.getInitialState();
    let payload = objectState.entities[data.getApiId()];
    payload = payload ? payload : data;
    payload = repopulateAttributes(payload, data);
    payload = repopulateRelations(payload, data, state);
    objectState = GlobalEntityAdapter.setOne(payload, objectState);
    state[jsonapiType] = objectState;
    return { ...state };
}

function relationReducer(state: GlobalEntityState, data: Model, relation: Model | Model[], relationName: string) {
    if (Array.isArray(relation)) {
        state = manyReducer(relation, state);
        relation = relation.map(
            (val) => getObjectFromStore(state, val)
        );
    } else {
        if (relation) {
            state = oneReducer(relation, state);
            relation = getObjectFromStore(state, relation);
        }
    }
    data.setRelation(relationName, relation);
    state = oneReducer(data, state);
    return state;
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

function getObjectFromStore(state: GlobalEntityState, obj: Model) {
    const baseType = obj.getJsonApiBaseType();
    const o = state[baseType].entities[obj.getApiId()];
    return o || obj;
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
    on(reducerFirstInit, (state, { entityStateKeys }) => firstInitReducer(entityStateKeys, state)),
    on(reducersSetRelation, (state, { payload, relation, relationName }) => relationReducer(state, payload, relation, relationName))
);

export function GlobalEntityReducer(state: GlobalEntityState | undefined, action: Action) {
    return _globaEntityReducer(state, action);
}