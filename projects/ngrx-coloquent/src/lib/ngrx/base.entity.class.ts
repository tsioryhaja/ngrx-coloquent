import { Model as AppModel } from '@herlinus/coloquent';
import { EntityActions, ReducerActions, ActionsContainer } from './base.entity.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, empty, EMPTY } from 'rxjs';
import { Builder } from '@herlinus/coloquent';
import { BaseQuery } from './base.entity.query';
import { Data } from '@angular/router';

export interface EntityActionParameters {
    variableName?: string
    onSuccess?: Function
    onFailure?: Function
}

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

    getOne$(id: number | string, parameters: EntityActionParameters = {}) {
        let data = { queryId: id }
        if (parameters.variableName) data['variableName'] = parameters.variableName
        data['parameters'] = parameters
        return this.store.dispatch(this.actions.getOne(data))
    }

    loadOne$(id: number | string, parameters: EntityActionParameters = {}) {
        let data = { queryId: id }
        if (parameters.variableName) data['variableName'] = parameters.variableName
        data['parameters'] = parameters
        return this.store.dispatch(this.actions.loadOne(data))
    }

    loadMany$(query: Builder, page?: number, parameters: EntityActionParameters = {}) {
        let data = { query: query, page: page }
        if (parameters.variableName) data['variableName'] = parameters.variableName
        data['parameters'] = parameters
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

    proxyOne$(variableName: string, payload: Data) {
        return this.store.dispatch(ActionsContainer.getVarialbeAction().proxyOne({ payload: payload, variableName: variableName }))
    }

    proxyMany$(variableName: string, payload: Data[]) {
        return this.store.dispatch(ActionsContainer.getVarialbeAction().proxyMany({ payload: payload, variableName: variableName }))
    }

    getVariable$(variableName: string): Observable<any> {
        return this.store.select( state => state.variables[variableName] )
    }

    getVariableData$(variableName: string): Observable<any> {
        return this.store.select(
            (state) => {
                let data = null;
                let variableState = state.variables[variableName];
                if (variableState) {
                    data = variableState.getData(state[this.collection].entities);
                }
                return data
            }
        )
    }

    saveOne(data: T): Observable<any> {
        return Observable.create(
            (observer) => {
                data.save().then(
                    (value) => {
                        observer.next(data)
                        observer.complete()
                    }
                ).catch(
                    (reason: any) => {
                        observer.error(reason)
                    }
                )
            }
        )
    }

    save$(data: T, parameters: EntityActionParameters = {}) {
        let _data = { data: data }
        _data['parameters'] = parameters
        return this.store.dispatch(this.actions.save(_data))
    }

    setEntityState(data: T, state, errors?) {
        let entity = data.getApiId() ? data.getApiId() : "new" 
        return this.collectionActions.setServerState({ entity, state, errors })
    }

    setError(errors) {
        
    }

    returnEmpty(): Observable<any> {
        return EMPTY
    }

    loadRelation(data: T, relationName: string) {
        return Observable.create(
            (observer) => {
                let d = data[relationName]()
                data[relationName]().get().then(
                    (value) => {
                        observer.next(value)
                        observer.complete()
                    }
                ).catch(
                    (err) => {
                        observer.error(err)
                        observer.complete()
                    }
                )
            }
        )
    }

    loadRelation$(data: T, relationName, parameters: EntityActionParameters = {}) {
        let _data = { data: data, relationName: relationName }
        if (parameters.variableName) _data['variableName'] = parameters.variableName
        _data['parameters'] = parameters
        return this.store.dispatch(this.actions.loadRelation(_data))
    }

    executeCallback$(data: any) {
        this.store.dispatch(this.actions.executeCallback(data))
    }

    deleteOne(data:T): Observable<any> {
        return Observable.create(
            (observer) => {
                data.delete().then(
                    (value) => {
                        observer.next({ data, value })
                        observer.complete()
                    }
                ).catch(
                    (reason) => {
                        observer.error(reason)
                        observer.complete()
                    }
                )
            }
        )
    }

    deleteOne$(data:T, parameters: EntityActionParameters = {}) {
        return this.store.dispatch(this.actions.deleteOne({ data: data, parameters: parameters }))
    }

}