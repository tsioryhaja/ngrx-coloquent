import { Injectable } from "@angular/core";
import { Model } from "@herlinus/coloquent";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { NGRX_COLOQUENT_ENTITY_KEY } from "../reducers/config";
import { NGRX_COLOQUENT_VARIABLE_KEY } from "./config";
import { reducerProxyEntities, reducerProxyEntity, reducerSetVariable } from "./variable.actions";
import { VariableState } from "./variable.reducer";

@Injectable()
export class GlobalVariableService {
    constructor(private store: Store) {}

    proxyOne$(model: Model, variableName: string) {
        this.store.dispatch(reducerProxyEntity({payload: model, variableName}));
    }

    proxyMany$(payloads: Model[], variableName: string) {
        this.store.dispatch(reducerProxyEntities({payloads, variableName}));
    }

    setVariable$(payload: any, variableName: string) {
        this.store.dispatch(reducerSetVariable({payload, variableName}));
    }

    getVariable(variableName: string) {
        return this.store.select(
            (state: any) => {
                const st = state[NGRX_COLOQUENT_VARIABLE_KEY];
                if (st) {
                    return st[variableName];
                } else {
                    return null;
                }
            }
        );
    }

    getProxiedVariable(variableName: string) {
        return this.store.select(
            (state: any) => {
                if (state[NGRX_COLOQUENT_VARIABLE_KEY]) {
                    const st = state[NGRX_COLOQUENT_VARIABLE_KEY];
                    if (st[variableName] && st[variableName].isEntityProxy) {
                        return st[variableName].getValue(state[NGRX_COLOQUENT_ENTITY_KEY]);
                    } else {
                        return;
                    }
                }
            }
        );
    }
}
