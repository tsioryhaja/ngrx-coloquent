import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PluralResponse, SaveResponse, SingularResponse } from "@herlinus/coloquent";
import { EMPTY, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Model } from "../models/models";
import { AngularBuilder } from "../models/query/builder";
import { AngularHttpClientResponse } from "../models/http-client/response";
import { AngularToOneRelation } from "../models/relation/one";

@Injectable()
export class AltEffectService {
    constructor(
        private http: HttpClient
    ) {}

    updateHttpConfig(config: any) {
        config = config ? config : {};
        config = {
            ...config,
            headers: {
                Accept: 'application/vndi.api+json',
                'Content-type': 'application/vnd.api+json'
            },
            observe: 'response'
        };
        return config;
    }

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
        let uri: string = query.getQuery().toString();
        const config = this.updateHttpConfig({});
        return this.http.get(query.getModelType().getJsonApiBaseUrl() + '/' + uri, config).pipe(
            map(
                (response: any) => {
                    const httpClientResponse = new AngularHttpClientResponse(response);
                    const pluralResponse = new PluralResponse(query.getQuery(), httpClientResponse, query.getModelType(), httpClientResponse.getData(), page);
                    return {
                        result: pluralResponse.getData(),
                        response: httpClientResponse
                    };
                }
            )
        );
    }

    findOne(
        query: any,
        id: any
    ) {
        let uri: string = query.getQuery().toString();
        const config = this.updateHttpConfig({});
        return this.http.get(query.getModelType().getJsonApiBaseUrl() + '/' + uri, config).pipe(
            map(
                (response: any) => {
                    const httpClientResponse = new AngularHttpClientResponse(response);
                    const singularResponse = new SingularResponse(query.getQuery(), httpClientResponse, query.getModelType(), httpClientResponse.getData());
                    return {
                        result: singularResponse.getData(),
                        response: httpClientResponse
                    };
                }
            )
        );
    }

    saveOne (data: Model) {
        let url = data.postUrl;
        const payload = data.publicSerialize();
        const config = this.updateHttpConfig({});
        let obs: Observable<any>;
        if (data.getApiId() && data.getApiId() !== '') {
            obs = this.http.patch(
                data.patchUrl,
                payload,
                config
            );
        } else {
            obs = this.http.post(
                data.postUrl,
                payload,
                config
            );
        }
        return obs.pipe(
            map(
                (response: any) => {
                    const httpClientResponse = new AngularHttpClientResponse(response);
                    const singularResponse = new SaveResponse(httpClientResponse, data.constructor, httpClientResponse.getData());
                    return {
                        result: singularResponse.getModel(),
                        response: httpClientResponse
                    };
                } 
            )
        )
    }

    loadRelation(data: Model, relationName: string) {
        return new Observable(
            (observer) => {
                data[relationName].get().then(
                    (value) => {
                        let response: SingularResponse | PluralResponse;
                        if (data[relationName] instanceof AngularToOneRelation) {
                            response = new SingularResponse(data[relationName].createAngularBuilder(true).getQuery(), value, data.constructor, value.getData());
                        } else {
                            response = new PluralResponse(data[relationName].createAngularBuilder(false).getQuery(), value, data.constructor, value.getData());
                        }
                        observer.next({result: response.getData(), response: value});
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