import { Injectable, Inject } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseJsonAPIService } from './base.entity.class';
import { Model as AppModel, PluralResponse } from '@herlinus/coloquent';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { isArray } from 'util';
import { ActionsContainer } from './base.entity.actions';

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
        if (!action.parameters) return
        let callback = isSuccess ? action.parameters.onSuccess : action.parameters.onFailure
        if (callback) this.service.executeCallback$({ data: data, callback: callback })
    }

    setRelationToStore(data: any) {
        let apiType = data.getJsonApiBaseType()
        let action = ActionsContainer.getReducerAction(apiType).setOne(data)
        this.store.dispatch(action)
    }

    getOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.getOne),
                exhaustMap(
                    (action) => {
                        return this.store.select(state => {
                            return state[this.service.getCollection()].entities[action.queryId]
                        }).pipe(
                            map(
                                (value: any) => {
                                    if(!value) {
                                        return this.service.actions.loadOne({ queryId: action.queryId })
                                    }
                                    else {
                                        this.executeParameter(action, value, true)
                                        if (action.variableName) this.service.proxyOne$(action.variableName, value)
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
                                    if (action.variableName) this.service.proxyOne$(action.variableName, value)
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
                                    if (action.variableName) this.service.proxyMany$(action.variableName, value)
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

    loadRelation$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.loadRelation),
                exhaustMap(
                    (action: any) => {
                        this.service.loadRelation(action.data, action.relationName).pipe(
                            map(
                                (value: any) => {
                                    let data = value.getData()
                                    if(isArray(data)) {
                                        this.setRelationToStore(data)
                                    } else {
                                        for (let element of data) {
                                            this.setRelationToStore(element)
                                        }
                                    }
                                    this.executeParameter(action, value, true)
                                }
                            ),
                            catchError(this.sendError('errors', action))
                        ).subscribe()
                        return this.service.returnEmpty()
                    }
                )
            )
        }
    )

    deleteOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.deleteOne),
                exhaustMap(
                    (action: any) => {
                        return this.service.deleteOne(action.data).pipe(
                            map(
                                (value) => {
                                    this.executeParameter(action, value.value, true)
                                    return this.service.collectionActions.removeOne({ payload: action.data })
                                }
                            ),
                            catchError(this.sendError('errors', action))
                        )
                    } 
                )
            )
        }
    )
}