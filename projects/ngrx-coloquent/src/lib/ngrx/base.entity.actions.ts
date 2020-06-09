import { Model as AppModel } from '@herlinus/coloquent';
import { createAction, props, Action } from '@ngrx/store';
import { Builder } from '@herlinus/coloquent';

export interface EntityActions {
    getOne: any
    loadOne: any
    loadMany: any
    save: any
}

export interface ReducerActions {
    setOne: any,
    setMany: any,
    removeOne: any,
    setServerState: any
}

export interface MapEntityAction {
    [k: string]: EntityActions
}

export interface MapReducerAction {
    [k: string]: ReducerActions
}

export interface VariableActions {
    set: any
}

export enum ServerStates {
    LOADING, VALID, INVALID
}

export function entityEffectsActions(jsonApiType: string): EntityActions {
    let actions =  {
        getOne: createAction('[' + jsonApiType + '/MODEL] Get One', props<{ queryId: number | string, variableName?: string }>()),
        loadOne: createAction('[' + jsonApiType + '/MODEL] Load One', props<{ queryId: number | string, variableName?: string }>()),
        loadMany: createAction('[' + jsonApiType + '/MODEL] Load Many', props<{ query: Builder, page: number, variableName?: string }>()),
        save: createAction('[' + jsonApiType + '/MODEL] Load Many', props<{ data: AppModel }>())
    }
    return actions
}

export function entityReducerActions(jsonApiType: string): ReducerActions {
    let actions = {
        setOne: createAction('[' + jsonApiType + '/API] Set One', props<{ payload: AppModel }>()),
        setMany: createAction('[' + jsonApiType + '/API] Set Many', props<{ payload: AppModel[] }>()),
        removeOne: createAction('[' + jsonApiType + '/API] Remove One', props<{ payload: AppModel }>()),
        setServerState: createAction('[' + jsonApiType + '/API] Remove', props<{ state: ServerStates, errors?: any }>())
    }
    return actions
}

export class ActionsContainer {
    private static actions: {
        effects: MapEntityAction,
        reducer: MapReducerAction,
        variable: VariableActions
    } = {
        effects: {},
        reducer: {},
        variable: {
            set: createAction('[Variable/DATA] Set',props<{ payload: any, variableName: string }>())
        }
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
}