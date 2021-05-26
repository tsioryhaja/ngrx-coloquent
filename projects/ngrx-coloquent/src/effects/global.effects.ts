import { HttpResponse } from "@angular/common/http";
import { Injectable, InjectionToken, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TypedAction } from "@ngrx/store/src/models";
import { EMPTY } from "rxjs";

import { catchError, concatMap, first, map, mergeMap, withLatestFrom } from "rxjs/operators";
import { reducerProxyEntities, reducerProxyEntity } from "../variables/variable.actions";
import { NGRX_COLOQUENT_ENTITY_KEY } from "../reducers/config";
import { reducerSetMany, reducersSetOne, reducerRemoveOne, reducersSetRelation } from "../reducers/global-reducers.actions";
import { EffectService } from "./effects.service";
import { notifyErrorAction } from "./errors";
import { effectsDeleteOne, EffectsDeleteOneProps, effectsExecuteCallback, effectsGetOne, EffectsGetOneProps, effectsLoadMany, EffectsLoadManyProps, effectsLoadOne, EffectsLoadOneProps, effectsLoadRelation, EffectsLoadRelationProps, effectsSave, EffectsSaveProps } from "./global-effects.actions";
import { getObjectReducer } from "../reducers/global.reducer";
import { Model } from "../models/models";

export interface NgrxColoquentGlobalEffectsPostprocessesInterface {
    getOne?: (data: Model, response: HttpResponse<any> | null) => Model;
    loadOne?: (data: Model, response: HttpResponse<any>) => Model;
    loadMany?: (data: Model[], response: HttpResponse<any>) => Model[];
    saveOne?: (data: Model, response: HttpResponse<any>) => Model;
    loadRelation?: (data: Model[], parent: Model, response: HttpResponse<any>) => Model;
    deleteOne? :(data: Model) => Model;
}

export interface NgrxColoquentGlobalEffectsPreprocessesInterface {
    getOne?: (action: EffectsGetOneProps & TypedAction<"[JSONAPI/MODEL] Get One">) => EffectsGetOneProps & TypedAction<"[JSONAPI/MODEL] Get One">;
    loadOne?: (action: EffectsLoadOneProps & TypedAction<"[JSONAPI/MODEL] Load One">) => EffectsLoadOneProps & TypedAction<"[JSONAPI/MODEL] Load One">;
    loadMany?: (action: EffectsLoadManyProps & TypedAction<"[JSONAPI/MODEL] Load Many">) => EffectsLoadManyProps & TypedAction<"[JSONAPI/MODEL] Load Many">;
    saveOne?: (action: EffectsSaveProps & TypedAction<"[JSONAPI/MODEL] Save One">) => EffectsSaveProps & TypedAction<"[JSONAPI/MODEL] Save One">;
    loadRelation?: (action: EffectsLoadRelationProps & TypedAction<"[JSONAPI/MODEL] Load Relation">) => EffectsLoadRelationProps & TypedAction<"[JSONAPI/MODEL] Load Relation">;
    deleteOne?: (action: EffectsDeleteOneProps & TypedAction<"[JSONAPI/MODEL] Delete One">) => EffectsDeleteOneProps & TypedAction<"[JSONAPI/MODEL] Delete One">;
}

export const NGRX_COLOQUENT_GLOBAL_EFFECTS_POSTPROCESSES = new InjectionToken<NgrxColoquentGlobalEffectsPostprocessesInterface[]>('NGRX_COLOQUENT_GLOBAL_EFFECTS_POSTPROCESSES');
export const NGRX_COLOQUENT_GLOBAL_EFFECTS_PREPROCESSES = new InjectionToken<NgrxColoquentGlobalEffectsPreprocessesInterface[]>('NGRX_COLOQUENT_GLOBAL_EFFECTS_PREPROCESSES');

@Injectable()
export class GlobalEffects {
    protected postprocesses: NgrxColoquentGlobalEffectsPostprocessesInterface[] = [];
    protected preprocesses: NgrxColoquentGlobalEffectsPreprocessesInterface[] = [];

    stateSelector = (state) => state[NGRX_COLOQUENT_ENTITY_KEY];

    postprocessExecutor = {
        default: (postprocess, key: string, data: any) => {
            data.model = postprocess[key](data.model, data.response);
            return data;
        },
        loadRelation: (postprocess, key: string, data: any) => {
            data.parent = postprocess[key](data.model, data.parent, data.response);
            return data;
        },
        deleteOne: (postprocess, key: string, data: any) => {
            data.model = postprocess[key](data.model, data.response);
            return data;
        }
    };

    constructor(
        protected actions$: Actions,
        protected store: Store,
        protected service: EffectService,
        protected injector: Injector
    ) {
        this.postprocesses = this.injector.get(NGRX_COLOQUENT_GLOBAL_EFFECTS_POSTPROCESSES, []);
        this.preprocesses = this.injector.get(NGRX_COLOQUENT_GLOBAL_EFFECTS_PREPROCESSES, []);
    }

    executePostprocesses(key: string, data: any) {
        const executor = this.postprocessExecutor[key] || this.postprocessExecutor['default'];
        for (const postprocess of this.postprocesses) {
            if (postprocess[key]) {
                data = executor(postprocess, key, data);
            }
        }
        return data;
    }

    executePreprocesses(key: string, action: any) {
        for (const preprocess of this.preprocesses) {
            if (preprocess[key]) {
                action = preprocess[key](action);
            }
        }
        return action;
    }

    executeParameters(action, data, isSuccess) {
        if (!isSuccess) {
            this.store.dispatch(notifyErrorAction({ origin: action, error: data }));
        }
        if (!action.parameters) {
            return;
        }
        const callback = isSuccess
          ? action.parameters.onSuccess
          : action.parameters.onFailure;
        if (callback) {
            this.store.dispatch(effectsExecuteCallback({data, callback}));
        }
    }

    sendError(errorKeyName, action) {
        return (err) => {
            this.executeParameters(action, err, false);
            return EMPTY;
        };
    }

    getOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(effectsGetOne),
                mergeMap(
                    action => {
                        action = this.executePreprocesses('getOne', action);
                        const entityType = action.entityType.getJsonApiBaseType();
                        return this.store.select(
                            (state: any) => {
                                return state[NGRX_COLOQUENT_ENTITY_KEY][entityType].entities[action.queryId];
                            }
                        ).pipe(first())
                        .pipe(
                            map(
                                (value: any) => {
                                    if (!value) {
                                        return effectsLoadOne({
                                            entityType: action.entityType,
                                            queryId: action.queryId,
                                            parameters: action.parameters,
                                            with: action.with,
                                            variableName: action.variableName
                                        });
                                    } else {
                                        const d = this.executePostprocesses('getOne', { model: value, response: null })
                                        value = d.model;
                                        this.executeParameters(action, value, true);
                                        if (action.parameters.variableName) {
                                            this.store.dispatch(reducerProxyEntity({ payload: value, variableName: action.parameters.variableName }));
                                        }
                                        return reducersSetOne({
                                            payload: value
                                        });
                                    }
                                }
                            )
                        );
                    }
                )
            );
        }
    );

    loadOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(effectsLoadOne),
                withLatestFrom(this.store.select(this.stateSelector)),
                mergeMap(
                    ([action, state]) => {
                        action = this.executePreprocesses('loadOne', action);
                        return this.service.loadOne(action.entityType, action.queryId, action.with)
                            .pipe(
                                map(
                                    (queryResult: any) => {
                                        let value = queryResult.result;
                                        value = getObjectReducer(value, state);
                                        if (value) {
                                            const d = this.executePostprocesses('loadOne', { model: value, response: queryResult.response.httpResponse });
                                            value = d.model;
                                        }
                                        this.executeParameters(action, value, true);
                                        if (action.parameters.variableName) {
                                            this.store.dispatch(reducerProxyEntity({ payload: value, variableName: action.parameters.variableName }));
                                        }
                                        return reducersSetOne({
                                            payload: value
                                        });
                                    }
                                ),
                                catchError(this.sendError('error', action))
                            )
                    }
                )
            );
        }
    );

    loadMany$ = createEffect(
        () => this.actions$.pipe(
                ofType(effectsLoadMany),
                withLatestFrom(this.store.select(this.stateSelector)),
                mergeMap(
                    ([action, state]) => {
                        action = this.executePreprocesses('loadMany', action);
                        return this.service.loadMany(action.query, action.page).pipe(
                            map(
                                (queryResult: any) => {
                                    let data = queryResult.result;
                                    data = data.map(
                                        (val) => getObjectReducer(val, state)
                                    );
                                    const d = this.executePostprocesses('loadMany', { model: data, response: queryResult.response.httpResponse });
                                    data = d.model;
                                    this.executeParameters(action, data, true);
                                    if (action.parameters.variableName) {
                                        this.store.dispatch(reducerProxyEntities({ payloads: data, variableName: action.parameters.variableName }));
                                    }
                                    return reducerSetMany({payloads: data});
                                }
                            ),
                            catchError(this.sendError('error', action))
                        );
                    }
                )
            )
    );

    saveOne$ = createEffect(
        () => this.actions$.pipe(
            ofType(effectsSave),
            withLatestFrom(this.store.select(this.stateSelector)),
            concatMap(
                ([action, state]) => {
                    action = this.executePreprocesses('saveOne', action);
                    return this.service.saveOne(action.data).pipe(
                        map(
                            (commandResult: any) => {
                                let value = commandResult.result;
                                value = getObjectReducer(value, state);
                                const d = this.executePostprocesses('saveOne', { model: value, response: commandResult.response.httpResponse });
                                value = d.model;
                                this.executeParameters(action, value, true);
                                if (action.parameters.variableName) {
                                    this.store.dispatch(reducerProxyEntity({ payload: value, variableName: action.parameters.variableName }));
                                }
                                return reducersSetOne({payload: value});
                            }
                        ),
                        catchError(this.sendError('error', action))
                    );
                }
            )
        )
    );

    executeFunction$ = createEffect(
        () => this.actions$.pipe(
            ofType(effectsExecuteCallback),
            mergeMap(
                (action: any) => {
                    const [callback, data] = [action.callback, action.data];
                    setTimeout(
                        () => callback(data),
                        20
                    );
                    return this.service.returnEmpty()
                }
            )
        )
    );

    loadRelation$ = createEffect(
        () => this.actions$.pipe(
            ofType(effectsLoadRelation),
            withLatestFrom(this.store.select(this.stateSelector)),
            mergeMap(
                ([action, state]) => {
                    action = this.executePreprocesses('loadRelation', action);
                    this.service.loadRelation(action.data, action.relationName).pipe(
                        catchError(this.sendError('error', action))
                    ).subscribe(
                        (data: any) => {
                            if (Array.isArray(data.result)) {
                                data.result = data.result.map((val) => getObjectReducer(val, state));
                            } else {
                                if (data.result) data.result = getObjectReducer(data.result, state);
                            }
                            const d = this.executePostprocesses('loadRelation', { model: data.result, parent: action.data, response: data.response.httpResponse });
                            this.executeParameters(action, d.model, true);
                            if (action.parameters.variableName) {
                                this.store.dispatch(reducerProxyEntities({ payloads: d.model, variableName: action.parameters.variableName }));
                            }
                            this.store.dispatch(reducersSetRelation({ payload: action.data, relation: d.model, relationName: action.relationName }));
                        },
                        catchError(this.sendError('error', action))
                    );
                    return this.service.returnEmpty();
                }
            )
        )
    );

    deleteOne$ = createEffect(
        () => this.actions$.pipe(
            ofType(effectsDeleteOne),
            concatMap(
                (action) => {
                    action = this.executePreprocesses('deleteOne', action);
                    return this.service.deleteOne(action.data).pipe(
                        map(
                            (value) => {
                                const d = this.executePostprocesses('deleteOne', { model: action.data });
                                action.data = d.model;
                                this.executeParameters(action, action.data, true);
                                return reducerRemoveOne({payload: action.data})
                            }
                        ),
                        catchError(this.sendError('error', action))
                    );
                }
            )
        )
    );
}
