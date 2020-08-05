import { Model as AppModel } from '@herlinus/coloquent';
import { EntityActions, ReducerActions, ActionsContainer, entityReducerActions, entityEffectsActions } from './base.entity.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, empty, EMPTY } from 'rxjs';
import { Builder } from '@herlinus/coloquent';
import { BaseQuery } from './base.entity.query';
import { Data } from '@angular/router';
import { NgrxColoquentConfigService } from './config';

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
    actionsData: EntityActions;
    reducersAction: ReducerActions;

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
        if (!this.reducersAction) {
            this.reducersAction = entityReducerActions(this.resource.getJsonApiBaseType());
        }
        return this.reducersAction;
    }

    get actions(): EntityActions {
        if (!this.actionsData) {
            this.actionsData = entityEffectsActions(this.getActualType());
        }
        return this.actionsData;
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
                page = page ? page : 1;
                builder.get(page).then(
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

    stateFromFeature(state) {
        let _state = state
        //if (NgrxColoquentConfigService.isInFeature) _state = _state[NgrxColoquentConfigService.featureName]
        return _state
    }

    storeFromFeature(selector) {
        if (NgrxColoquentConfigService.isInFeature)
            return this.store.select(NgrxColoquentConfigService.featureName).pipe(selector)
        else
            return this.store.select(selector)
    }

    selectOne(id: number | string): Observable<any> {
        return this.storeFromFeature(
            state => {
                let _state = this.stateFromFeature(state)
                return _state[this.collection].entities[id]
            }
        )
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
        return this.storeFromFeature( 
            state => {
                let _state = this.stateFromFeature(state)
                return _state.variables[variableName]
            }
        )
    }

    getVariableData$(variableName: string): Observable<any> {
        return this.storeFromFeature(
            (state) => {
                let data = null;
                let _state = this.stateFromFeature(state)
                let variableState = _state.variables[variableName];
                if (variableState) {
                    data = variableState.getData(_state);
                }
                return data;
            }
        )
    }

    getRelation$(data: T, relationName: string, parameters: EntityActionParameters = {}) {
        let _data = { data: data, relationName: relationName }
        if (parameters.variableName) _data['variableName'] = parameters.variableName
        _data['parameters'] = parameters
        return this.store.dispatch(this.actions.getRelation(_data))
    }

    getRelationData(data: T, relationName: string) {
        let relationKey: string = data.getJsonApiType() + '_' + data.getApiId() + '_' + relationName;
        return this.getVariableData$(relationKey)
    }

    getRelationVariableKey(data: T, relationName) {
        return 
    }

    /*getRelationSync$(data: T, relationName: string) {
        let relationKey: string = data.getJsonApiType() + '_' + data.getApiId() + '_' + relationName;
        return Observable.create(
            (observer) => {
                this.getRelationData(data, relationName).subscribe(
                    async (_data) => {
                        if (!_data) {
                            let _data = await data[relationName].get()
                            _data = _data.getData();
                            let action = null;
                            let proxyAction = null;
                            if (isArray(_data) && _data.length) {
                                let d = _data[0];
                                let jsonapiType = d.getJsonApiType();
                                action = ActionsContainer.getReducerAction(jsonapiType).setMany({ payload: _data })
                                proxyAction = this.proxyMany$(relationKey, _data)
                            }
                            else {
                                let jsonapiType = _data.getJsonApiType();
                                if (!_data) {
                                    action = ActionsContainer.getReducerAction(jsonapiType).setOne({ payload: _data })
                                    proxyAction = this.proxyMany$(relationKey, _data)
                                }
                            }
                            if (action) this.store.dispatch(action)
                            if (proxyAction) this.store.dispatch(proxyAction)
                        }
                        observer.next(data)
                        observer.complete()
                    },
                    error => {
                        observer.error(error)
                        observer.complete()
                    }
                )
            }
        )
        
    }*/

    saveOne(data: T): Observable<any> {
        return Observable.create(
            (observer) => {
                data.save().then(
                    (value) => {
                        observer.next(value.getModel());
                        observer.complete();
                    }
                ).catch(
                    (reason: any) => {
                        observer.error(reason);
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
                data[relationName].get().then(
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