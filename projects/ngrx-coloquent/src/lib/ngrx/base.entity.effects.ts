import { Injectable, Inject } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseJsonAPIService } from './base.entity.class';
import { Model as AppModel } from '@herlinus/coloquent';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { isArray } from 'util';

@Injectable()
export abstract class BaseEffects {

    constructor(protected service: BaseJsonAPIService<AppModel>, protected actions$: Actions, protected store: Store<any>) {}

    sendError(errorKeyName, action){
        return (err, caught: Observable<any>) => {
            this.executeParameter(action, err, false)
            return EMPTY
        }
    }

    executeParameter(action, data, isSuccess) {
        if (!action.parameter) return
        let callback = isSuccess ? action.parameter.onSuccess : action.parameter.onFailure
        if (callback) this.service.executeCallback$({ data: data, callback: callback })
    }

    getOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.getOne),
                exhaustMap(
                    (action) => {
                        return this.store.select(state => state[this.service.getCollection()].entities[action.queryId]).pipe(
                            map(
                                (value: any) => {
                                    if(!value) {
                                        return this.service.actions.loadOne({ queryId: action.queryId })
                                    }
                                    else {
                                        this.executeParameter(action, value, true)
                                        if (action.variableName) this.service.setVariable$(action.variableName, value)
                                        return this.service.getCollectionActions().setOne({ payload: value })
                                    }
                                }
                            ),
                            catchError(this.sendError('errors', action))
                        )
                    }
                )
            )
        }
    )

    loadOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.loadOne),
                exhaustMap(
                    (action) => {
                        return this.service.getOne(action.queryId).pipe(
                            map(
                                (value: any) => {
                                    this.executeParameter(action, value, true)
                                    if (action.variableName) this.service.setVariable$(action.variableName, value)
                                    return this.service.getCollectionActions().setOne({ payload: value })
                                }
                            ),
                            catchError(this.sendError('errors', action))
                        )
                    }
                )
            )
        }
    )

    loadMany$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.loadMany),
                exhaustMap(
                    (action) => {
                        return this.service.getMany(action.query, action.page).pipe(
                            map(
                                (value: any) => {
                                    this.executeParameter(action, value, true)
                                    if (action.variableName) this.service.setVariable$(action.variableName, value)
                                    return this.service.getCollectionActions().setMany({ payload: value.getData() })
                                }
                            ),
                            catchError(this.sendError('errors', action))
                        )
                    }
                )
            )
        }
    )

    saveOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.save),
                exhaustMap(
                    (action: any) => {
                        return this.service.saveOne(action.data).pipe(
                            map(
                                (value: any) => {
                                    this.executeParameter(action, value, true)
                                    return this.service.getCollectionActions().setOne({ payload: value })
                                }
                            ),
                            catchError(this.sendError('errors', action))
                        )
                    }
                )
            )
        }
    )

    executeFunction$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.executeCallback),
                exhaustMap(
                    (action: any) => {
                        let callback = action.callback
                        let data = action.data
                        callback(data)
                        return this.service.returnEmpty()
                    }
                )
            )
        }
    )

    /*loadRelation$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.loadRelation),
                exhaustMap(
                    (action: any) => {
                        return this.service.loadRelation(action.data, action.relationName).pipe(
                            map(
                                (value: any) => {
                                    let data = value.getData()
                                    if (!isArray(data)) data = [data]
                                }
                            )
                        )
                    }
                )
            )
        }
    )*/
    
}