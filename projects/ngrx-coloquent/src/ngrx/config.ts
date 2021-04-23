import { Injectable, Optional } from "@angular/core";
import { variableReducer } from './base.entity.reducer';

export interface NgrxColoquentConfig {
    featureName?: string
    isInFeature: boolean
}

@Injectable()
export class BaseNgrxColoquentConfigService {
    static featureName: string = null
    static isInFeature: boolean = false

    static getReducers() {
        return []
    }
}

@Injectable()
export class NgrxColoquentConfigService extends BaseNgrxColoquentConfigService {
    static featureName: string = null
    static isInFeature: boolean = false
    static reducers: any = {}
    reducers: any
    isInFeature: boolean
    featureName: string 
    constructor(@Optional() config: NgrxColoquentConfigService) {
        super();
        NgrxColoquentConfigService.featureName = config.featureName
        NgrxColoquentConfigService.isInFeature = config.isInFeature
        NgrxColoquentConfigService.reducers = config.reducers
    }
    static getReducers() {
        return { variables: variableReducer(), ...NgrxColoquentConfigService.reducers };
    }
    static getFeatureName() {
        const d = NgrxColoquentConfigService.featureName;
        return NgrxColoquentConfigService.featureName;
    }
}