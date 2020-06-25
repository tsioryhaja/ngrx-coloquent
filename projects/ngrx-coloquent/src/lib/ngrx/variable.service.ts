import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { NgrxColoquentConfigService } from './config';
import { Observable } from 'rxjs';
import { ActionsContainer } from './base.entity.actions';
import { Data } from '@angular/router';

@Injectable()
export class VariablesService {
    constructor(private store: Store<any>) {
    }

    storeFromFeature(selector) {
        if (NgrxColoquentConfigService.isInFeature)
            return this.store.select(NgrxColoquentConfigService.featureName).pipe(selector)
        else
            return this.store.select(selector)
    }

    stateFromFeature(state) {
        let _state = state
        //if (NgrxColoquentConfigService.isInFeature) _state = _state[NgrxColoquentConfigService.featureName]
        return _state
    }

    getVariableData$(variableName: string): Observable<any> {
        return this.storeFromFeature(
            (state) => {
                let data = null;
                let _state = this.stateFromFeature(state)
                let variableState = _state.variables[variableName];
                if (variableState) {
                    data = variableState.getData(_state);
                }
                return data;
            }
        )
    }

    getVariable$(variableName: string): Observable<any> {
        return this.storeFromFeature( 
            state => {
                let _state = this.stateFromFeature(state)
                return _state.variables[variableName]
            }
        )
    }

    proxyOne$(variableName: string, payload: Data) {
        return this.store.dispatch(ActionsContainer.getVarialbeAction().proxyOne({ payload: payload, variableName: variableName }))
    }

    proxyMany$(variableName: string, payload: Data[]) {
        return this.store.dispatch(ActionsContainer.getVarialbeAction().proxyMany({ payload: payload, variableName: variableName }))
    }

    setVariable$(variableName: string ,payload: Data) {
        return this.store.dispatch(ActionsContainer.getVarialbeAction().set({ payload: payload, variableName: variableName }))
    }
}