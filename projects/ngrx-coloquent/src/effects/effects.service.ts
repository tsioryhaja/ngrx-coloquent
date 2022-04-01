import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { Model } from "../models/models";
import { AngularBuilder } from "../models/query/builder";
import { BaseGlobalEffectService } from "./effect.service.interface";

@Injectable()
export class EffectService implements BaseGlobalEffectService {
    constructor() {}

    returnEmpty(): Observable<any> {
        return EMPTY
    }

    loadOne(
        BaseModel: typeof Model,
        queryId: number | string,
        included?: string[]
    ) {
        return new Observable(
            (subscriber) => {
                let query = BaseModel.query$();
                for (const field of included) {
                    query = query.with(field);
                }
                query.find(queryId).onSuccess(
                    (result, response) => {
                        subscriber.next({result, response});
                        subscriber.complete();
                    }
                ).onError(
                    error => {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                ).start();
            }
        )
    }


    loadMany(
        query: any,
        page: any
    ) {
        return new Observable(
            (subscriber) => {
                query.__get(page).then(
                    (data: any) => {
                        const result = data.getData();
                        const response = data.getHttpClientResponse();
                        subscriber.next({result, response});
                        subscriber.complete();
                    },
                    (error: any) => {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                ).catch(
                    (error: any) => {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                );
            }
        );
    }

    findOne(
        query: any,
        id: any
    ) {
        return new Observable(
            (subscriber) => {
                query.__find(id).then(
                    (data) => {
                        const result = data.getData();
                        const response = data.getHttpClientResponse();
                        subscriber.next({result, response});
                        subscriber.complete();
                    },
                    (error) => {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                ).catch(
                    error => {
                        subscriber.error(error);
                        subscriber.complete();
                    }
                );
            }
        );
    }

    saveOne (data: Model, forceCreate: boolean=false) {
        return new Observable(
            (observer) => {
                if (!data.isDirty()) {
                    observer.next(data);
                    observer.complete();
                }
								
                data.__save(forceCreate).then(
                    (value) => {
                        const result = value.getModel();
                        const response = value.getHttpClientResponse();
                        observer.next({result, response});
                        observer.complete();
                    },
                    (error) => {
                        observer.error(error);
                        observer.complete();
                    }
                ).catch(
                    (reason) => {
                        observer.error(reason);
                        observer.complete();
                    }
                );
            }
        );
    }

    loadRelation(data: Model, relationName: string) {
        return new Observable(
            (observer) => {
                data[relationName].__get().then(
                    (value) => {
                        const result = value.getModel();
                        const response = value.getHttpClientResponse();
                        observer.next({result, response});
                        observer.complete();
                    },
                    (error: any) => {
                        observer.error(error);
                        observer.complete();
                    }
                ).catch(
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    }
                );
            }
        );
    }

    deleteOne(data: Model) {
        return new Observable(
            (observer) => {
                data.__delete().then(
                    (value) => {
                        observer.next(data);
                        observer.complete();
                    },
                    (error) => {
                        observer.error(error);
                        observer.complete();
                    }
                )
                .catch(
                    (reason) => {
                        observer.error(reason);
                        observer.complete();
                    }
                );
            }
        );
    }
}
