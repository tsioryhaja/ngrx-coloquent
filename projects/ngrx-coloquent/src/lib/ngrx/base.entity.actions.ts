import { Model as AppModel } from '@herlinus/coloquent';
import { createAction, props, Action, createReducer, on } from '@ngrx/store';
import { Builder } from '@herlinus/coloquent';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProxyOneData, ProxyManyData } from './proxy';

export interface EntityActions {
    getOne: any
    loadOne: any
    loadMany: any
    save: any
    loadRelation: any
    getRelation: any
    executeCallback: any,
    deleteOne: any
}

export interface ReducerActions {
    setOne: any,
    setMany: any,
    removeOne: any,
    setServerState: any,
    setErrors: any
}

export interface MapEntityAction {
    [k: string]: EntityActions
}

export interface MapReducerAction {
    [k: string]: ReducerActions
}

export interface VariableActions {
    set: any
    proxyOne: any
    proxyMany: any
}

export enum ServerStates {
    LOADING, VALID, INVALID
}

export function entityEffectsActions(jsonApiType: string): EntityActions {
    let actions =  {
        getOne: createAction('[' + jsonApiType + '/MODEL] Get One', props<{ queryId: number | string, variableName?: string, parameters?: any }>()),
        loadOne: createAction('[' + jsonApiType + '/MODEL] Load One', props<{ queryId: number | string, variableName?: string, parameters?: any }>()),
        loadMany: createAction('[' + jsonApiType + '/MODEL] Load Many', props<{ query: Builder, page: number, variableName?: string, parameters?: any }>()),
        save: createAction('[' + jsonApiType + '/MODEL] Save One', props<{ data: AppModel, parameters?: any }>()),
        loadRelation: createAction('[' + jsonApiType + '/MODEL] Load Relation', props<{ data: AppModel, relationName: string, variableName?: string, parameters?: any }>()),
        getRelation: createAction('[' + jsonApiType + '/MODEL] Get Relation', props<{ data: AppModel, relationName: string, variableName?: string, parameters?: any }>()),
        executeCallback: createAction('[' + jsonApiType + '/EFFECTS] Execute Action', props<{ data: any, callback: Function }>()),
        deleteOne: createAction('[' + jsonApiType + '/MODEL] Delete One', props<{ data: any, parameters?: any }>())
    }
    return actions
}

export function entityReducerActions(jsonApiType: string): ReducerActions {
    let actions = {
        setOne: createAction('[' + jsonApiType + '/API] Set One', props<{ payload: AppModel }>()),
        setMany: createAction('[' + jsonApiType + '/API] Set Many', props<{ payload: AppModel[] }>()),
        removeOne: createAction('[' + jsonApiType + '/API] Remove One', props<{ payload: AppModel }>()),
        setServerState: createAction('[' + jsonApiType + '/API] Set State', props<{ entity: string, state: ServerStates, errors?: any }>()),
        setErrors: createAction('[' + jsonApiType + '/ANY] Set Error', props<{ errors: any }>())
    }
    return actions
}

export const variableActions = {
    set: createAction('[Variable/DATA] Set',props<{ payload: any, variableName: string }>()),
    proxyOne: createAction('[Variable/DATA] Proxy One', props<{ payload: any, variableName: string }>()),
    proxyMany: createAction('[Variable/DATA] Proxy Many', props<{ payload: any, variableName: string }>())
}

export class ActionsContainer {
    static effects: any[] = []
    private static services = {}
    private static actions: {
        effects: MapEntityAction,
        reducer: MapReducerAction,
        variable: VariableActions
    } = {
        effects: {},
        reducer: {},
        variable: variableActions
    }

    static setEffectAction(jsonApiName: string, actions: EntityActions) {
        this.actions.effects[jsonApiName] = actions
    }

    static getEffectAction(jsonApiName: string): EntityActions {
        let d = this.actions.effects[jsonApiName];
        return d
    }

    static setReducerAction(jsonApiName: string, actions: ReducerActions) {
        this.actions.reducer[jsonApiName] = actions
    }

    static getReducerAction(jsonApiName: string): ReducerActions {
        let d = this.actions.reducer[jsonApiName]
        return d
    }

    static getVarialbeAction(): VariableActions {
        let d = this.actions.variable
        return d
    }

    static hasEffects(target: any ) {
        let data = new target()
        let jsonApiName = data.getJsonApiType()
        let effectActions = entityEffectsActions(jsonApiName)
        ActionsContainer.setEffectAction(jsonApiName, effectActions)
    }

    static hasReducer(target: any) {
        let jsonApiName = target.getJsonApiBaseType()
        let reducerActions = entityReducerActions(jsonApiName)
        let effectActions = entityEffectsActions(jsonApiName)
        ActionsContainer.setReducerAction(jsonApiName, reducerActions)
        ActionsContainer.setEffectAction(jsonApiName, effectActions)
    }

    static effect(target: any) {
        ActionsContainer.effects.push(target)
    }

    static getEffects() {
        return ActionsContainer.effects
    }
}