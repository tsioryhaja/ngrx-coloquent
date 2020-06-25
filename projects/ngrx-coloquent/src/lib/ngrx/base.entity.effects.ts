import { Injectable, Inject } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseJsonAPIService } from './base.entity.class';
import { Model as AppModel, PluralResponse } from '@herlinus/coloquent';
import { exhaustMap, map, catchError, first } from 'rxjs/operators';
import { EMPTY, Observable, never } from 'rxjs';
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
        let action = ActionsContainer.getReducerAction(apiType).setOne({ payload: data })
        this.store.dispatch(action)
    }

    getOne$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.getOne),
                exhaustMap(
                    (action) => {
                        return this.service.storeFromFeature(state => {
                            let _state = this.service.stateFromFeature(state)
                            return state[this.service.getCollection()].entities[action.queryId]
                        }).pipe(first()).pipe(
                            map(
                                (value: any) => {
                                    if(!value) {
                                        return this.service.actions.loadOne({ queryId: action.queryId, parameters: action.parameters })
                                    }
                                    else {
                                        this.executeParameter(action, value, true)
                                        if (action.parameters.variableName) this.service.proxyOne$(action.parameters.variableName, value)
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
                                    if (action.parameters.variableName) this.service.proxyOne$(action.parameters.variableName, value)
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
                                    if (action.parameters.variableName) this.service.proxyMany$(action.parameters.variableName, value.getData())
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
                        setTimeout( () => { callback(data) }, 20)
                        return this.service.returnEmpty()
                    }
                )
            )
        }
    )

    getRelation$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(this.service.actions.getRelation),
                exhaustMap(
                    (action) => {
                        let relationKey: string = action.data.getJsonApiType() + '_' + action.data.getApiId() + '_' + action.relationName;
                        this.service.getVariableData$(relationKey).pipe(first()).subscribe(
                            (data) => {
                                let response = null
                                if (!data) this.service.loadRelation$(action.data, action.relationName, action.parameters);
                                else {
                                    if (isArray(data)) {
                                        this.service.proxyMany$(relationKey, data);
                                        if (action.parameters.variableName) {
                                            this.service.proxyMany$(action.parameters.variableName, data);
                                        }
                                    }
                                    else {
                                        this.service.proxyOne$(relationKey, data);
                                        if (action.parameters.variableName) {
                                            this.service.proxyOne$(action.parameters.variableName, data);
                                        }
                                    }
                                    this.executeParameter(action, data, true);
                                } 
                            }
                        )
                        return this.service.returnEmpty();
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
                        let relationKey: string = action.data.getJsonApiType() + '_' + action.data.getApiId() + '_' + action.relationName;
                        this.service.loadRelation(action.data, action.relationName).subscribe(
                            (value: any) => {
                                let data = value.getData()
                                if(!isArray(data)) {
                                    if (data) {
                                        this.service.proxyOne$(relationKey, data)
                                        this.setRelationToStore(data)
                                    }
                                } else {
                                    for (let element of data) {
                                        this.service.proxyMany$(relationKey, data)
                                        this.setRelationToStore(element)
                                    }
                                }
                                if (action.parameters.variableName){
                                    if (isArray(data)) {
                                        this.service.proxyMany$(action.parameters.variableName, data)
                                    } else {
                                        this.service.proxyOne$(action.parameters.variableName, data)
                                    }
                                }
                                this.executeParameter(action, value, true)
                            },
                            catchError(this.sendError('errors', action))
                        )
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