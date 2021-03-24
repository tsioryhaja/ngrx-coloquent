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
    '[JSONAPI/MODEL] Delete One',
    props<{ payload: Model }>()
);