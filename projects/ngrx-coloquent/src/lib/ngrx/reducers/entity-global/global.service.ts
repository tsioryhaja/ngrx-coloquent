import { Injectable } from "@angular/core";
import { Builder, Model } from "@herlinus/coloquent";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EntityActionParameters } from "../../base.entity.class";
import { effectsDeleteOne, effectsGetOne, effectsLoadMany, effectsLoadOne, effectsLoadRelation, effectsSave } from "../../effects/global-effects.actions";
import { NGRX_COLOQUENT_ENTITY_KEY } from "./config";

@Injectable()
export class GlobalEntityService {

    constructor(
        private store: Store
    ) {}

    getOne$(entityType: typeof Model, id: number | string, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        let data = {queryId: id, entityType: entityType, parameters, with: includedRelationships, variableName: parameters.variableName};
        this.store.dispatch(effectsGetOne(data));
    }

    loadOne$(entityType: typeof Model, id: number | string, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        let data = {queryId: id, entityType, parameters, with: includedRelationships, variableName: parameters.variableName};
        this.store.dispatch(effectsLoadOne(data));
    }

    loadMany$(query: Builder, page?: number, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        let data = {query, page, parameters, variableName: parameters.variableName, with: includedRelationships};
        this.store.dispatch(effectsLoadMany(data));
    }

    loadRelation$(model: Model, relationName: string, parameters: EntityActionParameters = {}) {
        let data = {data: model, relationName, variableName: parameters.variableName, parameters};
        this.store.dispatch(effectsLoadRelation(data));
    }

    deleteOne$(model: Model, parameters: EntityActionParameters = {}) {
        let data = {data: model, parameters};
        this.store.dispatch(effectsDeleteOne(data));
    }

    saveOne$(model: Model, parameters: EntityActionParameters = {}) {
        let data = {data: model, parameters};
        this.store.dispatch(effectsSave(data));
    }

    selectEntity(selectorFunction: Function, entityType: typeof Model, customContentFilter: Observable<any>[]) {
        let baseSelector = [this.store.select(
            (state: any) => state[NGRX_COLOQUENT_ENTITY_KEY],
            (state: any) => {
                return state[entityType.getJsonApiBaseType()].entities;
            }
        )];
        baseSelector = baseSelector.concat(customContentFilter);
        return combineLatest(baseSelector).pipe(
            map(
                (value: any[], index: number) => selectorFunction.apply(null, value)
            )
        );
    }
}
