import { Injectable } from "@angular/core";

@Injectable()
export class NgrxColoquentVariableConfig {
    variableKey: string = 'variables';
    static variableKey: string = 'variables';
    constructor(config: NgrxColoquentVariableConfig){
        this.variableKey = config.variableKey;
        NgrxColoquentVariableConfig.variableKey = config.variableKey;
    }
}

export const NGRX_COLOQUENT_VARIABLE_KEY = "ngrx_coloquent_variable_key";