import { Injectable } from "@angular/core";

@Injectable()
export class NgrxColoquentGlobalConfig {
    reducerKey: string = 'entities';
    static reducerKey: string = 'entities';
    constructor(baseService: NgrxColoquentGlobalConfig) {
        this.reducerKey = baseService.reducerKey;
        NgrxColoquentGlobalConfig.reducerKey = this.reducerKey;
    }
}

export const NGRX_COLOQUENT_ENTITY_KEY = 'ngrx_coloquent_entities_key';