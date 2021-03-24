import { Model } from "@herlinus/coloquent";
import { createAction, props } from "@ngrx/store";

export const reducerSetVariable = createAction(
    '[SERVICE] Set Variable',
    props<{ payload: any, variableName: string }>()
);

export const reducerProxyEntity = createAction(
    '[SERVICE] Proxy Entity',
    props<{payload: Model, variableName: string}>()
);

export const reducerProxyEntities = createAction(
    '[SERVICE] Proxy Entities',
    props<{payloads: Model[], variableName: string}>()
);
