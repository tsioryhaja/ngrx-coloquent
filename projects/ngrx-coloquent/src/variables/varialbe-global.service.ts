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
            (state: any) => state[NGRX_COLOQUENT_VARIABLE_KEY],
            (state: VariableState) => state[variableName]
        );
    }

    getProxiedVariable(variableName: string) {
        return combineLatest([
            this.store.select(state => state[NGRX_COLOQUENT_ENTITY_KEY]),
            this.store.select(state => state[NGRX_COLOQUENT_VARIABLE_KEY])
        ]).pipe(
            map(
                ([entities, variables]) => {
                    let st = variables;
                    if (!st[variableName] && !st[variableName].isEntityProxy) {
                        return null;
                    } else {
                        return st[variableName].getValue(entities);
                    }
                }
            )
        );
    }
}
