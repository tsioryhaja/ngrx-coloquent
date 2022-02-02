import { HttpResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { PluralResponse, SaveResponse, SingularResponse } from "@herlinus/coloquent";
import { AngularHttpClientResponse, BaseGlobalEffectService, EffectService, Model } from "projects/ngrx-coloquent/src/public-api";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Sound } from "./collaborator";

@Injectable({
    providedIn: 'root'
})
export class SoundEffectService extends EffectService {
    constructor(
        private service: EffectService,
        private injector: Injector
    ) {
        super();
    }

    actions: any = {
        loadMany: 'fetchCollection{Type}Get',
        loadOne: 'fetchObject{Type}IdGet',
        createOne: 'createObject{Type}Post',
        updateOne: 'updateObject{Type}IdPatch',
        deleteOne: 'deleteObject{Type}IdDelete'
    };

    services: any = {};

    __modelTypeName: string;

    getModelTypeName(modelType): string {
        if (!this.__modelTypeName) {
            const m = new (<any> modelType)();
            this.__modelTypeName = m.getJsonApiType();
        }
        return this.__modelTypeName;
    }

    getCustomService(baseModel: typeof Model) {
        if (!this.services[baseModel.getJsonApiType()]) {
            if (baseModel['customService']) {
                this.services[baseModel.getJsonApiType()] = this.injector.get(baseModel['customService']);
            }
        }
        return this.services[baseModel.getJsonApiType()];
    }

    getNameMethodName(BaseModel: typeof Model, action: string) {
        const template = this.actions[action];
        return template.replace('{Type}', BaseModel.getJsonApiType());
    }

    getPaginationParameters(query, page) {
        const paginations: any = {};
        const paginationsParamters = query.getQuery().getPaginationSpec().getPaginationParameters();
        console.log(paginationsParamters);
        for (const pagination of paginationsParamters) {
            if (pagination.name === query.getModelType().getPaginationPageNumberParamName()) {
                paginations.number = pagination.value;
            }
            if (pagination.name === query.getModelType().getPaginationPageSizeParamName()) {
                paginations.size = pagination.value;
            }
        }
        paginations.number = paginations.number ? paginations.number : 1;
        paginations.number = page;
        paginations.size = paginations.size ? paginations.size : 50;
        return paginations;
    }

    getQueryFilters(query, page) {
        const filters = query.getQuery().getFilters();
        const options = query.getQuery().getOptions();
        const currentFilters = [];
        let realFilters: any;
        for (const option of options) {
            if (option.getParameter() === 'filter') {
                realFilters = option.getValue();
                realFilters = JSON.parse(realFilters);
                realFilters = realFilters.map(e => JSON.stringify(e));
            }
        }
        for (const filter of filters) {
            currentFilters.push({
                name: filter.attribute,
                op: 'eq',
                val: filter.value
            })
        }
        if (currentFilters.length > 0) {
            realFilters = currentFilters.map(e => JSON.stringify(e));
        }
        const pSpecs = this.getPaginationParameters(query, page)
        return {
            filter: realFilters,
            ...pSpecs
        }
    }

    loadMany(query: any, page: any): Observable<any> {
        const BaseModel = query.getModelType();
        const service = this.getCustomService(BaseModel);
        if (service) {
            const methodName = this.getNameMethodName(BaseModel, 'loadMany');
            const realFilters = this.getQueryFilters(query, page);
            return service[methodName]({
                filter: realFilters,
                ...this.getPaginationParameters(query, page)
            }).pipe(
                map(
                    (response: any) => {
                        const httpClientResponse = new AngularHttpClientResponse(new HttpResponse({body: response}));
                        const pluralResponse = new PluralResponse(query.getQuery(), httpClientResponse, query.getModelType(), httpClientResponse.getData(), page);
                        return {
                            result: pluralResponse.getData(),
                            response: httpClientResponse
                        };
                    }
                )
            );
        } else {
            return this.service.loadMany(query, page);
        }
    }

    findOne(query, id) {
        const BaseModel = query.getModelType();
        const service = this.getCustomService(BaseModel);
        if (service) {
            const methodName = this.getNameMethodName(BaseModel, 'loadOne');
            return service[methodName]({id: id}).pipe(
                map(
                    (response) => {
                        const httpClientResponse = new AngularHttpClientResponse(new HttpResponse({body: response}));
                        const singularResponse = new SingularResponse(query.getQuery(), httpClientResponse, query.getModelType(), httpClientResponse.getData());
                        return {
                            result: singularResponse.getData(),
                            response: httpClientResponse
                        };
                    }
                )
            );
        } else {
            return this.service.findOne(query, id);
        }
    }

    saveOne(data) {
        const BaseModel = data.constructor;
        const service = this.getCustomService(BaseModel);
        if (service) {
            let methodName: string;
            let parameters: any = {}
            if (data.getApiId() && data.getApiId() !== '') {
                methodName = this.getNameMethodName(BaseModel, 'updateOne');
                parameters.id = data.getApiId();
            } else {
                methodName = this.getNameMethodName(BaseModel, 'createOne');
            }
            parameters.body = data.publicSerialize()
            return service[methodName]({
                ...parameters
            }).pipe(
                map(
                    (response: any) => {
                        const httpClientResponse = new AngularHttpClientResponse(new HttpResponse({body: response}));
                        const singularResponse = new SaveResponse(httpClientResponse, BaseModel, httpClientResponse.getData());
                        return {
                            result: singularResponse.getModel(),
                            response: httpClientResponse
                        };
                    }
                )
            );
        } else {
            return this.service.saveOne(data);
        }
    }

    deleteOne(data) {
        const BaseModel = data.constructor;
        const service = this.getCustomService(BaseModel);
        if(service) {
            const methodName = this.getNameMethodName(BaseModel, 'loadOne');
            return service[methodName]({id: data.getApiId()}).pipe(
                map(
                    (response) => {
                        return data;
                    }
                )
            );
        }
    }
}