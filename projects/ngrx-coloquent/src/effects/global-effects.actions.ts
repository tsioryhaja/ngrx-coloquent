import { Builder } from "@herlinus/coloquent";
import { createAction, props } from "@ngrx/store";
import { Model } from "../models/models";

export interface EffectsGetOneProps {
    entityType: typeof Model;
    queryId: string | number;
    parameters?: any;
    with?: string[];
    variableName?: string;
}

export const effectsGetOne = createAction(
    '[JSONAPI/MODEL] Get One',
    props<EffectsGetOneProps>()
);

export interface EffectsLoadOneProps {
    entityType: typeof Model;
    queryId: string | number
    parameters?: any;
    with?: string[];
    variableName?: string;
}

export const effectsLoadOne = createAction(
    '[JSONAPI/MODEL] Load One',
    props<EffectsLoadOneProps>()
);

export interface EffectsLoadManyProps {
    query: Builder;
    page: number;
    variableName?: string;
    parameters?: any;
    with?: string[];
}

export const effectsLoadMany = createAction(
    '[JSONAPI/MODEL] Load Many',
    props<EffectsLoadManyProps>()
);

export interface EffectsFindOneProps {
    query: Builder;
    variableName?: string;
    parameters?: any;
    id: any;
}

export const effectsFindOne = createAction(
    '[JSONAPI/MODEL] FindOne',
    props<EffectsFindOneProps>()
);

export interface EffectsFirstProps {
    query: Builder;
    variableName?: string;
    parameters?: any;
}

export const effectsFirst = createAction(
    '[JSONAPI/MODEL] FindOne',
    props<EffectsFirstProps>()
);

export interface EffectsSaveProps {
    data: any;
    parameters?: any;
	forceCreate?: boolean;
}

export const effectsSave = createAction(
    '[JSONAPI/MODEL] Save One',
    props<EffectsSaveProps>()
);

export interface EffectsLoadRelationProps {
    data: any;
    relationName: string;
    variableName?: string;
    parameters?: any;
}

export const effectsLoadRelation = createAction(
    '[JSONAPI/MODEL] Load Relation',
    props<EffectsLoadRelationProps>()
);

export interface EffectsLoadRelationManyProps {
    query: any;
    model: any;
    relationName: string;
    variableName?:string;
    parameters?: any;
}

export const effectsExecuteCallback = createAction(
    '[JSONAPI/MODEL] Execute Callback',
    props<{
        data: any,
        response?: any,
        callback: any
    }>()
);

export interface EffectsDeleteOneProps {
    data: any;
    parameters?: any;
}

export const effectsDeleteOne = createAction(
    '[JSONAPI/MODEL] Delete One',
    props<EffectsDeleteOneProps>()
);

export const effectsEmptyReducer = createAction(
    '[JSONAPI/MODEL] Empty'
);
