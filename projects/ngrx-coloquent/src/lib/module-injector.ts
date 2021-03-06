import { InjectionToken } from '@angular/core';
import { NgrxColoquentConfigService } from '../ngrx/config';

export const REDUCER_TOKEN = new InjectionToken<any>('Registered Reducers', {
    factory: () => {
        return NgrxColoquentConfigService.getReducers();
    }
})

export const FEATURE_CONFIG_TOKEN = new InjectionToken<any>('Registered Reducers Feature Config', {
    factory: () => {
        const reducers = NgrxColoquentConfigService.getReducers();
        const initialState = {}
        for (let reducer_name in reducers) {
            let reducer = reducers[reducer_name]
            initialState[reducer_name] = reducer(void 0, {type: 'None'})
        }
        return {initialState: initialState};
    }
})