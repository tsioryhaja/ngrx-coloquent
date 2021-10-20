import { Model } from "@herlinus/coloquent";
import { createAction, props } from "@ngrx/store";

export const reducersSetOne = createAction(
    '[JSONAPI/MODEL] Set One',
    props<{
        payload: Model,
        variableName?: string
    }>()
);

export const reducerSetMany = createAction(
    '[JSONAPI/MODEL] Set Many',
    props<{
        payloads: Model[],
        variableName?: string
    }>()
);

export const reducerRemoveOne = createAction(
    '[JSONAPI/MODEL] Remove One',
    props<{ payload: Model }>()
);

export const reducerFirstInit = createAction(
    '[JSONAPI/NGRX-COLOQUENT] First Init',
    props<{ entityStateKeys: string[] }>()
);

export const reducersSetRelation = createAction(
    '[JSONAPI/MODEL] Set Relation',
    props<{
        payload: Model,
        relationName: string,
        relation: Model | Model[]
    }>()
);
