import { Injectable, Inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseJsonAPIService } from './base.entity.class';
import { Model as AppModel, PluralResponse } from '@herlinus/coloquent';
import {
  exhaustMap,
  map,
  catchError,
  first,
  concatMap,
  mergeMap,
} from 'rxjs/operators';
import { EMPTY, Observable, never } from 'rxjs';
import { ActionsContainer } from './base.entity.actions';

@Injectable()
export abstract class BaseEffects {
  constructor(
    protected service: BaseJsonAPIService<AppModel>,
    protected actions$: Actions,
    protected store: Store<any>
  ) {}

  getOne$ = createEffect(() => {
    console.log('Get Log One');
    return this.actions$.pipe(
      ofType(this.service.actions.getOne),
      mergeMap((action) => {
        return this.service
          .storeFromFeature((state) => {
            let _state = this.service.stateFromFeature(state);
            return state[this.service.getCollection()].entities[action.queryId];
          })
          .pipe(first())
          .pipe(
            map((value: any) => {
              if (!value) {
                return this.service.actions.loadOne({
                  queryId: action.queryId,
                  with: action.with,
                  parameters: action.parameters,
                });
              } else {
                this.executeParameter(action, value, true);
                if (action.parameters.variableName) {
                  this.service.proxyOne$(action.parameters.variableName, value);
                }
                return this.service
                  .getCollectionActions()
                  .setOne({ payload: value });
              }
            }),
            catchError(this.sendError('errors', action))
          );
      })
    );
  });

  loadOne$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.loadOne),
      mergeMap((action) => {
        return this.service.getOne(action.queryId, action.with).pipe(
          map((value: any) => {
            this.executeParameter(action, value, true);
            if (action.parameters.variableName) {
              this.service.proxyOne$(action.parameters.variableName, value);
            }
            this.correctRelationship([value]);
            return this.service
              .getCollectionActions()
              .setOne({ payload: value });
          }),
          catchError(this.sendError('errors', action))
        );
      })
    );
  });

  loadMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.loadMany),
      mergeMap((action) => {
        return this.service.getMany(action.query, action.page).pipe(
          map((value: any) => {
            this.executeParameter(action, value, true);
            const data = value.getData();
            this.correctRelationship(data);
            if (action.parameters.variableName) {
              this.service.proxyMany$(
                action.parameters.variableName,
                value.getData()
              );
            }
            return this.service
              .getCollectionActions()
              .setMany({ payload: value.getData() });
          }),
          catchError(this.sendError('errors', action))
        );
      })
    );
  });

  saveOne$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.save),
      concatMap((action: any) => {
        return this.service.saveOne(action.data).pipe(
          map((value: any) => {
            this.executeParameter(action, value, true);
            this.correctRelationship([value]);
            return this.service
              .getCollectionActions()
              .setOne({ payload: value });
          }),
          catchError(this.sendError('errors', action))
        );
      })
    );
  });

  executeFunction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.executeCallback),
      mergeMap((action: any) => {
        const callback = action.callback;
        const data = action.data;
        setTimeout(() => {
          callback(data);
        }, 20);
        return this.service.returnEmpty();
      })
    );
  });

  getRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.getRelation),
      mergeMap((action) => {
        const relationKey: string =
          action.data.getJsonApiType() +
          '_' +
          action.data.getApiId() +
          '_' +
          action.relationName;
        this.service
          .getVariableData$(relationKey)
          .pipe(first())
          .subscribe((data) => {
            if (!data) {
              this.service.loadRelation$(
                action.data,
                action.relationName,
                action.parameters
              );
            }
            else {
              if (Array.isArray(data)) {
                this.service.proxyMany$(relationKey, data);
                if (action.parameters.variableName) {
                  this.service.proxyMany$(action.parameters.variableName, data);
                }
              } else {
                this.service.proxyOne$(relationKey, data);
                if (action.parameters.variableName) {
                  this.service.proxyOne$(action.parameters.variableName, data);
                }
              }
              this.executeParameter(action, data, true);
            }
          });
        return this.service.returnEmpty();
      })
    );
  });

  loadRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.loadRelation),
      mergeMap((action: any) => {
        const relationKey: string =
          action.data.getJsonApiType() +
          '_' +
          action.data.getApiId() +
          '_' +
          action.relationName;
        this.service
          .loadRelation(action.data, action.relationName)
          .subscribe((value: any) => {
            const data = value.getData();
            if (!Array.isArray(data)) {
              if (data) {
                this.service.proxyOne$(relationKey, data);
                this.setRelationToStore(data);
              }
            } else {
              for (const element of data) {
                this.service.proxyMany$(relationKey, data);
                this.setRelationToStore(element);
              }
            }
            action.data.setRelation(action.relationName, data);
            if (action.parameters.variableName) {
              if (Array.isArray(data)) {
                this.service.proxyMany$(action.parameters.variableName, data);
              } else {
                this.service.proxyOne$(action.parameters.variableName, data);
              }
            }
            this.executeParameter(action, value, true);
          }, catchError(this.sendError('errors', action)));
        return this.service.returnEmpty();
      })
    );
  });

  deleteOne$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(this.service.actions.deleteOne),
      concatMap((action: any) => {
        return this.service.deleteOne(action.data).pipe(
          map((value) => {
            this.executeParameter(action, value.value, true);
            return this.service.collectionActions.removeOne({
              payload: action.data,
            });
          }),
          catchError(this.sendError('errors', action))
        );
      })
    );
  });

  sendError(errorKeyName, action) {
    return (err, caught: Observable<any>) => {
      this.executeParameter(action, err, false);
      return EMPTY;
    };
  }

  executeParameter(action, data, isSuccess) {
    if (!action.parameters) {
        return;
    }
    const callback = isSuccess
      ? action.parameters.onSuccess
      : action.parameters.onFailure;
    if (callback) {
      this.service.executeCallback$({ data, callback });
    }
  }

  setRelationToStore(data: any) {
    const apiType = data.getJsonApiBaseType();
    const action = ActionsContainer.getReducerAction(apiType).setOne({
      payload: data,
    });
    this.store.dispatch(action);
  }

  correctRelationship(datas: any[]) {
      this.store.select(
          state => state
      ).pipe(first()).subscribe(
          state => {
                for (const data of datas) {
                    const relationships = data.getRelations();
                    for (const relationKey of Object.keys(relationships)) {
                        const relation = relationships[relationKey];
                        if (Array.isArray(relation)) {
                            const newRelation = [];
                            for (const relationItem of relation) {
                                const entityState = state[relationItem.getJsonApiBaseType()].entities;
                                const entityInState = relationItem.getApiId() in entityState;
                                let newRelationItem = entityState[relationItem.getApiId()];
                                if (!entityInState) {
                                    this.setRelationToStore(relationItem);
                                }
                                newRelationItem = entityInState ? newRelationItem : relationItem;
                                newRelation.push(newRelationItem);
                            }
                            data.setRelation(relationKey, newRelation);
                        } else if (relation) {
                            const entityState = state[relation.getJsonApiBaseType()].entities;
                            const entityInState = relation.getApiId() in entityState;
                            let newRelation = entityState[relation.getApiId()];
                            newRelation = entityInState ? newRelation : relation;
                            if (!entityInState) {
                                this.setRelationToStore(relation);
                            }
                            data.setRelation(relationKey, newRelation);
                        }
                    }
            }
          }
      );
  }
}
