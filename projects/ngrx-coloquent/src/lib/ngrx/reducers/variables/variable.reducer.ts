import { Model } from "@herlinus/coloquent";
import { Action, createReducer, on } from "@ngrx/store";
import { reducerSetMany, reducersSetOne } from "../entity-global/global-reducers.actions";
import { EntityProxy, MultipleEntityProxy } from "./entity-proxy.class";
import { reducerProxyEntities, reducerProxyEntity, reducerSetVariable } from "./variable.actions";

export interface VariableState {
    [name: string]: any;
}

function setVariable(state: VariableState, variableName: string, payload: any) {
    state[variableName] = payload;
    return { ...state };
}

function proxyEntity(state: VariableState, variableName: string, payload: Model) {
    if (variableName) {
        let proxy = new EntityProxy(payload);
        state[variableName] = proxy;
    }
    return { ...state };
}

function proxyManyEntity(state: VariableState, variableName: string, payloads: Model[]) {
    if (variableName) {
        state[variableName] = new MultipleEntityProxy(payloads);
    }
    return { ...state };
}

const _variableReducer = createReducer(
    {},
    on(reducerSetVariable, (state: VariableState, { payload, variableName }) => setVariable(state, variableName, payload)),
    on(reducersSetOne, (state: VariableState, { payload, variableName }) => proxyEntity(state, variableName, payload)),
    on(reducerSetMany, (state: VariableState, { payloads, variableName }) => proxyManyEntity(state, variableName, payloads)),
    on(reducerProxyEntity, (state: VariableState, { payload, variableName }) => proxyEntity(state, variableName, payload)),
    on(reducerProxyEntities, (state: VariableState, { payloads, variableName }) => proxyManyEntity(state, variableName, payloads))
);

export function VariableReducer(state: VariableState | undefined, action: Action) {
    return _variableReducer(state, action);
}