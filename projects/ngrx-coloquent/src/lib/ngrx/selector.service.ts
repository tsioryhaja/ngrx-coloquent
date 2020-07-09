import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import { Model } from '@herlinus/coloquent';

@Injectable()
export class SelectorService {
    constructor(private store: Store<any>) {
    }

    entityFilter(entityType: typeof Model, selector: any, customNeeded: any[] = []) {
        const customFeature = (state: any) => {
            return state[entityType.getJsonApiBaseType()].entities;
        };
        const selectorFunction = (states, extraContent) => {
            const stateList: any[] = Object.values(states);
            return stateList.filter(item => {
                const content = [item, ...extraContent];
                return selector.apply(null, content);
            });
        };
        return this.buildSelector(customFeature, selectorFunction, customNeeded);
    }

    buildSelector(customFeature: (states) => any, selector: (states, extra) => any, customNeeded: any[] = []) {
        const customFeature2 = (state: any) => {
            const requirementsData = [];
            for (const requirementFunction of customNeeded) {
                requirementsData.push(
                    requirementFunction(state)
                );
            }
            return requirementsData;
        };
        const customSelector = createSelector(
            customFeature,
            customFeature2,
            (states, extraContent) => {
                return selector(states, extraContent);
            }
        );
        return this.store.select(customSelector);
    }

    variableSelector(variableName: string, isProxy: boolean = false) {
        const customFeature = (state: any) => {
            let data = state.variables[variableName];
            if (data && isProxy) {
                data = data.getData(state);
            }
            return data;
        };
        return customFeature;
    }
}
