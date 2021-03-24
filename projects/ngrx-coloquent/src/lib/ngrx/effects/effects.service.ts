import { Injectable } from "@angular/core";
import { Builder, Model } from "@herlinus/coloquent";
import { EMPTY, Observable } from "rxjs";

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
                let query = BaseModel.query();
                for (const field of included) {
                    query = query.with(field);
                }
                query.find(queryId).then(
                    (data) => {
                        const entity = data.getData();
                        subscriber.next(entity);
                        subscriber.complete()
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
        query: Builder,
        page: any
    ) {
        return new Observable(
            (subscriber) => {
                query.get(page).then(
                    (data: any) => {
                        subscriber.next(data.getData());
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

    saveOne (data: Model) {
        return new Observable(
            (observer) => {
                if (!data.isDirty()) {
                    observer.next(data);
                    observer.complete();
                }
                data.save().then(
                    (value) => {
                        observer.next(value.getModel());
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
                        observer.next(value.getData());
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