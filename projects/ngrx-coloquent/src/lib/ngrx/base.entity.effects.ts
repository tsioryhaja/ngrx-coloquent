import { Injectable, Inject } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseJsonAPIService } from './base.entity.class';
import { Model as AppModel } from '@herlinus/coloquent';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Injectable()
export abstract class BaseEffects {

    constructor(protected service: BaseJsonAPIService<AppModel>, protected actions$: Actions, protected store: Store<any>) {}

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
                                        if (action.variableName) this.service.setVariable$(action.variableName, value)
                                        return this.service.getCollectionActions().setOne({ payload: value })
                                    }
                                }
                            )
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
                                    if (action.variableName) this.service.setVariable$(action.variableName, value)
                                    return this.service.getCollectionActions().setOne({ payload: value })
                                }
                            )
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
                                    if (action.variableName) this.service.setVariable$(action.variableName, value)
                                    return this.service.getCollectionActions().setMany({ payload: value.getData() })
                                }
                            )
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
                                    return this.service.getCollectionActions().setOne({ payload: value })
                                }
                            ),
                            catchError(
                                (err, caught: Observable<any>) => {
                                    let d = err
                                    if (d.response) d = d.response.data.errors
                                    this.service.setVariable$('errors', d)
                                    return EMPTY
                                }
                            )
                        )
                    }
                )
            )
        }
    )
    
}