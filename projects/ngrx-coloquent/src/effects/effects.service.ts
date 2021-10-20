import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { Model } from "../models/models";

@Injectable()
export class EffectService {
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
                let query = BaseModel.__query();
                for (const field of included) {
                    query = query.with(field);
                }

                query.find(queryId).then(
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

    saveOne (data: Model) {
        return new Observable(
            (observer) => {
                if (!data.isDirty()) {
                    observer.next(data);
                    observer.complete();
                }
                data.save().then(
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
                data[relationName].get().then(
                    (value) => {
                        const result = value.getData();
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
                data.delete().then(
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