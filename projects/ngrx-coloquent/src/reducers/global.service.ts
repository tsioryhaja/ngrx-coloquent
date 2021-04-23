import { Injectable, InjectionToken, Injector } from "@angular/core";
import { Builder } from "@herlinus/coloquent";
import { Action, Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EntityActionParameters } from "../ngrx/base.entity.class";
import { effectsDeleteOne, effectsGetOne, effectsLoadMany, effectsLoadOne, effectsLoadRelation, effectsSave } from "../effects/global-effects.actions";
import { NGRX_COLOQUENT_ENTITY_KEY } from "./config";
import { Model } from "../models/models";


export interface EffectsStartActionInterface {
    effectsGetOne?: any, effectsLoadOne?: any, effectsLoadMany?: any, effectsLoadRelation?: any, effectsDeleteOne?: any, effectsSave?: any
}

function filterByEntity(state: any, entityTypes: string[]) {
    const arrays = Object.entries(state).filter(
        ([key, value]: [string, any]) =>  entityTypes.indexOf(value.getJsonApiType())
    );
    const result = {};
    for (const [rowKey, rowValue] of arrays) {
        result[rowKey] = rowValue;
    }
    return result;
}

export const DefaultEffectsStartAction: EffectsStartActionInterface = {
    effectsGetOne,
    effectsLoadOne,
    effectsLoadMany,
    effectsLoadRelation,
    effectsSave,
    effectsDeleteOne
};

export const NGRX_COLOQUENT_EFFECTS_START_ACTIONS = new InjectionToken<EffectsStartActionInterface>('NGRX_COLOQUENT_EFFECTS_START_ACTIONS');

@Injectable()
export class GlobalEntityService {
    protected effectsStartActions: EffectsStartActionInterface;
    lastLoad = {};
    nextPage = {};
    lastPage = {};

    constructor(
        private store: Store,
        private injector: Injector
    ) {
        this.effectsStartActions = this.injector.get(NGRX_COLOQUENT_EFFECTS_START_ACTIONS, {});
    }

    getOne$(entityType: typeof Model, id: number | string, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        let data = {queryId: id, entityType: entityType, parameters, with: includedRelationships, variableName: parameters.variableName};
        const action = this.effectsStartActions.effectsGetOne || DefaultEffectsStartAction.effectsGetOne;
        this.store.dispatch(action(data));
    }

    loadOne$(entityType: typeof Model, id: number | string, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        let data = {queryId: id, entityType, parameters, with: includedRelationships, variableName: parameters.variableName};
        const action = this.effectsStartActions.effectsLoadOne || DefaultEffectsStartAction.effectsLoadOne;
        this.store.dispatch(action(data));
    }

    loadMany$(query: Builder, page?: number, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        let data = {query, page, parameters, variableName: parameters.variableName, with: includedRelationships};
        const action = this.effectsStartActions.effectsLoadMany || DefaultEffectsStartAction.effectsLoadMany;
        this.store.dispatch(action(data));
    }

    loadRelation$(model: Model, relationName: string, parameters: EntityActionParameters = {}) {
        let data = {data: model, relationName, variableName: parameters.variableName, parameters};
        const action = this.effectsStartActions.effectsLoadRelation || DefaultEffectsStartAction.effectsLoadRelation;
        this.store.dispatch(action(data));
    }

    deleteOne$(model: Model, parameters: EntityActionParameters = {}) {
        let data = {data: model, parameters};
        const action = this.effectsStartActions.effectsDeleteOne || DefaultEffectsStartAction.effectsDeleteOne;
        this.store.dispatch(this.effectsStartActions.effectsDeleteOne(data));
    }

    saveOne$(model: Model, parameters: EntityActionParameters = {}) {
        let data = {data: model, parameters};
        const action = this.effectsStartActions.effectsSave;
        this.store.dispatch(this.effectsStartActions.effectsSave(data));
    }

    selectEntity(selectorFunction: Function, entityType: typeof Model, customContentFilter: Observable<any>[] = []) {
        let baseSelector = [this.store.select(
            (state: any) => state[NGRX_COLOQUENT_ENTITY_KEY])
            .pipe(
                map(
                    (state: any) => {
                        return filterByEntity(state[entityType.getJsonApiBaseType()].entities, entityType.getModelKeys());
                    }
                )
            )
        ];
        baseSelector = baseSelector.concat(customContentFilter);
        return combineLatest(baseSelector).pipe(
            map(
                (value: any[], index: number) => selectorFunction.apply(null, value)
            )
        );
    }

    getMayNeedLoad(key) {
        if (!this.lastLoad[key]) {
            return true;
        }
        if (this.nextPage[key] > this.lastPage[key]) {
            return true;
        }
        const dateNow = new Date();
        const dateAfter30Min = new Date(this.lastLoad[key].getTime() + (30 * 60 * 1000));
        return dateNow >= dateAfter30Min;
    }

    getLoadNextQuery(model, parameters, key) {
        if (!this.nextPage[key]) {
            this.nextPage[key] = 1;
        }
        if (!this.lastPage[key]) {
            this.lastPage[key] = 1;
        }
        if (this.getMayNeedLoad(key)) {
            let query = model.query$();
            for (const param of parameters) {
                query = query[param.key].apply(query, param.value);
            }
            return [query, this.nextPage[key]];
        } else {
            return null;
        }
    }

    updateNextKeys(key, length, model) {
        this.lastPage[key] = this.nextPage[key];
        if (length >= model.getPageSize()) this.nextPage[key] = this.nextPage[key] + 1;
        this.lastLoad[key] = new Date();
    }
}
