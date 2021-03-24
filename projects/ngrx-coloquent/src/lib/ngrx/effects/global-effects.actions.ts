import { Model, Builder } from "@herlinus/coloquent";
import { createAction, props } from "@ngrx/store";

export const effectsGetOne = createAction(
    '[JSONAPI/MODEL] Get One',
    props<{
        entityType: typeof Model,
        queryId: string | number,
        parameters?: any,
        with?: string[],
        variableName?: string
    }>()
);

export const effectsLoadOne = createAction(
    '[JSONAPI/MODEL] Load One',
    props<{
        entityType: typeof Model,
        queryId: string | number,
        parameters?: any,
        with?: string[],
        variableName?: string
    }>()
);

export const effectsLoadMany = createAction(
    '[JSONAPI/MODEL] Load Many',
    props<{
        query: Builder,
        page: number,
        variableName?: string,
        parameters?: any,
        with?: string[]
    }>()
);

export const effectsSave = createAction(
    '[JSONAPI/MODEL] Save One',
    props<{
        data: any,
        parameters?: any,
    }>()
);

export const effectsLoadRelation = createAction(
    '[JSONAPI/MODEL] Load Relation',
    props<{
        data: any,
        relationName: string,
        variableName?: string,
        parameters?: any
    }>()
);

export const effectsExecuteCallback = createAction(
    '[JSONAPI/MODEL] Execute Callback',
    props<{
        data: any,
        callback: Function
    }>()
);

export const effectsDeleteOne = createAction(
    '[JSONAPI/MODEL] Delete One',
    props<{
        data: any,
        parameters?: any
    }>()
);

export const effectsEmptyReducer = createAction(
    '[JSONAPI/MODEL] Empty'
);