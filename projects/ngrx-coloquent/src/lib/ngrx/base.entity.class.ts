import { Model as AppModel } from '@herlinus/coloquent';
import { EntityActions, ReducerActions, ActionsContainer } from './base.entity.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Builder } from '@herlinus/coloquent';
import { BaseQuery } from './base.entity.query';
import { Data } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseJsonAPIService<T extends AppModel> {
    protected abstract resource: any
    protected abstract resourceType: string

    getCollection(): string {
        return this.collection
    }

    protected getActualType() {
        let _target = new this.resource()
        return _target.getJsonApiType()
    }

    getCollectionActions(): ReducerActions {
        return this.collectionActions
    }

    get collection() {
        return this.resource.getJsonApiBaseType()
    }

    get collectionActions(): ReducerActions {
        return ActionsContainer.getReducerAction(this.collection)
    }

    get actions(): EntityActions {
        return ActionsContainer.getEffectAction(this.resourceType)
    }

    constructor(protected store: Store<any>) {
    }

    getOne$(id: number | string, variableName?: string) {
        let data = { queryId: id }
        if (variableName) data['variableName'] = variableName
        return this.store.dispatch(this.actions.getOne(data))
    }

    loadOne$(id: number | string, variableName?: string) {
        let data = { queryId: id }
        if (variableName) data['variableName'] = variableName
        return this.store.dispatch(this.actions.loadOne(data))
    }

    loadMany$(query: Builder, page?: number, variableName?: string) {
        let data = { query: query, page: page }
        if (variableName) data['variableName'] = variableName
        return this.store.dispatch(this.actions.loadMany(data))
    }

    getOne(id: number | string): Observable<any> {
        return Observable.create(
            (observer) => {
                this.resource.find(id).then(
                    (data) => {
                        let entity = data.getData();
                        observer.next(entity)
                        observer.complete()
                    }
                )
            }
        )
    }

    getMany(builder: Builder, page: number): Observable<any> {
        return Observable.create(
            (observer) => {
                builder.get().then(
                    (data: any) => {
                        observer.next(data)
                        observer.complete()
                    }
                )
            }
        )
    }

    getStore() {
        return this.store
    }

    selectOne(id: number | string): Observable<any> {
        return this.getStore().select(state => state[this.collection].entities[id])
    }

    query() {
        let builder = this.resource.query()
        let query = new BaseQuery(this, builder)
        return query
    }

    setVariable$(variableName: string ,payload: Data) {
        return this.store.dispatch(ActionsContainer.getVarialbeAction().set({ payload: payload, variableName: variableName }))
    }

    getVariable$(variableName: string): Observable<any> {
        return this.store.select( state => state.variables[variableName] )
    }

    saveOne(data: T): Observable<any> {
        return Observable.create(
            (observer) => {
                data.save().then(
                    (value) => {
                        observer.next(data)
                        observer.complete()
                    }
                )
            }
        )
    }

    save$(data: T) {
        return this.store.dispatch(this.actions.save({ data: data }))
    }
}