import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY } from "rxjs";

import { catchError, concatMap, first, map, mergeMap } from "rxjs/operators";
import { NGRX_COLOQUENT_ENTITY_KEY } from "../reducers/entity-global/config";
import { reducerSetMany, reducersSetOne, reducerRemoveOne } from "../reducers/entity-global/global-reducers.actions";
import { EffectService } from "./effects.service";
import { effectsDeleteOne, effectsExecuteCallback, effectsGetOne, effectsLoadMany, effectsLoadOne, effectsLoadRelation, effectsSave } from "./global-effects.actions";

@Injectable()
export class GlobalEffects {
    constructor(
        protected actions$: Actions,
        protected store: Store,
        protected service: EffectService
    ) {}

    executeParameters(action, data, isSuccess) {
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
                                        this.executeParameters(action, value, true);
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
                mergeMap(
                    action => {
                        return this.service.loadOne(action.entityType, action.queryId, action.with)
                            .pipe(
                                map(
                                    (value: any) => {
                                        console.log(action);
                                        this.executeParameters(action, value, true);
                                        return reducersSetOne({
                                            payload: value
                                        });
                                    }
                                )
                            )
                    }
                )
            );
        }
    );

    loadMany$ = createEffect(
        () => this.actions$.pipe(
                ofType(effectsLoadMany),
                mergeMap(
                    (action) => {
                        return this.service.loadMany(action.query, action.page).pipe(
                            map(
                                (data: any) => {
                                    this.executeParameters(action, data, true);
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
            concatMap(
                (action) => {
                    return this.service.saveOne(action.data).pipe(
                        map(
                            (value: any) => {
                                this.executeParameters(action, value, true);
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
                    console.log(action);
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
            mergeMap(
                (action) => {
                    this.service.loadRelation(action.data, action.relationName).subscribe(
                        (data: any) => {
                            this.executeParameters(action, data, true);
                            if (!Array.isArray(data)) {
                                if (data) {
                                    this.store.dispatch(reducersSetOne({payload: data}));
                                }
                            } else {
                                this.store.dispatch(reducerSetMany({ payloads: data }));
                            }
                        }
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
                    return this.service.deleteOne(action.data).pipe(
                        map(
                            (value) => {
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
