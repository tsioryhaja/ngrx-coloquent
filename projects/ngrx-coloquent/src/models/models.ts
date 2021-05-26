import { HttpClient, Model as Model_, PaginationStrategy, PluralResponse, SingularResponse } from '@herlinus/coloquent';
import { PolymorphicEntry, PolymorphicMapping } from '@herlinus/coloquent/dist/PolymorphicModel';
import { Builder } from '@herlinus/coloquent';
import { EntityActionParameters } from '../ngrx/base.entity.class';
import { AngularHttpClient } from './http-client/class';
import { NoServiceException } from './exceptions';
import { Observable } from 'rxjs';
import { QueryBuilder, StartPromise } from './query-builder';

const NO_SERVICE_ERROR_MESSAGE = "There was no service setted for the entities. Check if you are inside angular execution context or if the NgrxColoquentModule is not imported";

export class Entities {
    static jsonapiReducers: string[] = [];
    static hasReducer(): any;
    static hasReducer(target?: typeof Model): any;

    static hasReducer(target?: typeof Model) {
        if (target) Entities.executeHasReducer(target);
        else return Entities.executeHasReducer;
    }

    static executeHasReducer(target?: any) {
        const jsonapiBaseType = target.getJsonApiBaseType();
        !(jsonapiBaseType in Entities.jsonapiReducers) ? Entities.jsonapiReducers.push(jsonapiBaseType) : null;
    }
}

class PolymorphicChildren {

    private childrendKeys: string[] = [];

    constructor(private children: any[]) {
        for (const child of children) {
            this.childrendKeys.push(child.getJsonApiType());
        }
    }

    push(klass: any, key: string) {
        this.children.push(klass);
        this.childrendKeys.push(key);
    }

    getChildren() {
        return this.children;
    }

    getChildrenKeys() {
        return this.childrendKeys;
    }
}

// @dynamic
export abstract class Model extends Model_ {
    protected static paginationStrategy = PaginationStrategy.PageBased;
    static baseUrl: string = null;

    static polymorphicOn = null;

    static polymorphicChild: PolymorphicChildren = null;

    static ngrxColoquentService: any = null;

    static addPolymorphicChild(klass: any, key: string) {
        if (!this.polymorphicChild) return;
        this.polymorphicChild.push(klass, key);
        Object.getPrototypeOf(this).addPolymorphicChild(klass, key);
    }

    static initPolymorphicChild() {
        this.polymorphicChild = new PolymorphicChildren([]);
    }

    static initIfNotPolymorphicChild(root = false) {
        if (!this.polymorphicChild) {
            this.initPolymorphicChild();
            if (root) {
                this.addPolymorphicChild(this, this.getJsonApiBaseType())
            }
        }
    }

    static getPolymorphicChild() {
        return this.polymorphicChild;
    }

    static getModelKeys() {
        return this.polymorphicChild ? this.polymorphicChild.getChildrenKeys() : [this.getJsonApiBaseType()];
    }

    static initPolymorphicOn() {
        this.polymorphicOn = this.polymorphicOn || new PolymorphicMapping([]);
    }

    static appendPolymorph(value: string) {
        let that = this;
        that.initPolymorphicOn();
        that.initIfNotPolymorphicChild(true);
        return (klass: any) => {
            klass.JsonApiBaseType_ = that.getJsonApiBaseType();
            klass.initPolymorphicChild();
            that.polymorphicOn.polymorphicEntries.push( new PolymorphicEntry(klass, value));
            klass.addPolymorphicChild(klass, value);
            return klass;
        }
    }

    static getClass(doc: any) {
        return this.polymorphicOn.getClass(doc.type) || this;
    }

    constructor() {
        super();
        Model._httpClient[this.getJsonApiBaseUrl()] = null;
    }

    static setGlobalHttpClient (httpClient: HttpClient) {
        this._httpClient['.'] = httpClient;
    }

    static setBaseHttpClient(httpClient: AngularHttpClient) {
        this._httpClient = {
            '': this._httpClient['']
        };
        this._httpClient['angular-http-client'] = httpClient;
    }

    static get httpClient(): HttpClient {
        let httpClient = this._httpClient[this.getJsonApiBaseUrl()];
        if (!httpClient && this._httpClient['angular-http-client'] && this._httpClient['angular-http-client'].httpClient) {
            const newHttpClient = new AngularHttpClient(this._httpClient['angular-http-client'].httpClient);
            newHttpClient.setBaseUrl(this.getJsonApiBaseUrl());
            this._httpClient[this.getJsonApiBaseUrl()] = newHttpClient;
            httpClient = newHttpClient;
        } else {
            httpClient = this._httpClient[''];
        }
        return httpClient;
    }

    static set httpClient(value: HttpClient) {
        this._httpClient[this.getJsonApiBaseUrl()] = value;
    }

    public getJsonApiBaseUrl(){
        return this.constructor.getJsonApiBaseUrl();
    }

    public static getJsonApiBaseUrl(): string {
        return '';
    }

    public static getJsonApiBaseType(): string{
        if(this.JsonApiBaseType_){
            return this.JsonApiBaseType_;
        }
        const currentObject = new (<any> this)();
        return currentObject.getJsonApiType();
    }
    
    public getJsonApiBaseType(): string{
        if(this.constructor.JsonApiBaseType_){
            return this.constructor.JsonApiBaseType_;
        }
        return this.getJsonApiType();
    }

    static getOne$(id: number | string, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        if (!this.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        this.ngrxColoquentService.getOne$(this, id, parameters, includedRelationships);
    }

    static loadOne$(id: number |string, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        if (!this.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        this.ngrxColoquentService.loadOne$(this, id, parameters, includedRelationships);
    }

    static loadMany$(query: Builder, page: number = 1, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        if (!this.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        this.ngrxColoquentService.loadMany$(query, page, parameters, includedRelationships);
    }

    static selectEntity$(selectorFunction: Function, customContentFilter: Observable<any>[] = []) {
        if (!this.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        return this.ngrxColoquentService.selectEntity(selectorFunction, this, customContentFilter);
    }

    _loadRelation(relationName: string, parameters: EntityActionParameters) {
        if (!Model.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        Model.ngrxColoquentService.loadRelation$(this, relationName, parameters);
    }

    _save(parameters: EntityActionParameters = {}) {
        if (!Model.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        Model.ngrxColoquentService.saveOne$(this, parameters);
    }

    _delete(parameters: EntityActionParameters = {}) {
        if (!Model.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        Model.ngrxColoquentService.deleteOne$(this, parameters);
    }

    static query$(): QueryBuilder {
        return new QueryBuilder(this);
    }

    static find$(id: number |string | any, includedRelationships: string[] = []) {
        const that = this;
        return new StartPromise((parameters: EntityActionParameters) => {
            that.loadOne$(id, parameters, includedRelationships);
        });
    }

    loadRelation$(relationName: string) {
        const that = this;
        return new StartPromise((parameters: EntityActionParameters) => {
            that._loadRelation(relationName, parameters);
        });
    }

    save$() {
        const that = this;
        return new StartPromise((parameters: EntityActionParameters) => {
            that._save(parameters);
        });
    }

    delete$() {
        const that = this;
        return new StartPromise((parameters: EntityActionParameters) => {
            that._delete(parameters);
        });
    }

    static loadNext(key, _parameters) {
        if (!this.ngrxColoquentService) throw new NoServiceException(NO_SERVICE_ERROR_MESSAGE);
        const that = this;
        return new StartPromise((parameters: EntityActionParameters) => {
            const callback = parameters.onSuccess;
            parameters.onSuccess = (data) => {
                if (callback) {
                    callback(data);
                }
                that.ngrxColoquentService.updateNextKeys(key, data.length, that);
            }
            const _loadNext: Array<any> | null = that.ngrxColoquentService.getLoadNextQuery(that, _parameters, key)
            if (_loadNext) {
                const [query, page] = _loadNext;
                that.loadMany$(query.getBuilder(), page, parameters);
            }
        });
    }

    static __query() {
        return super.query();
    }

    /*public static __get(page?: number) {
        return super.get(page);
    }

    public static get(page?: number): Promise<PluralResponse> {
        const that = this;
        return new Promise((resolve, reject) => {
                let query = that.query$();
                query.get(page)
                    .onSuccess((data) => {
                        resolve(
                            new PluralResponse(query.getBuilder().getQuery(), new AngularHttpClientResponse(new HttpResponse()), that, data)
                        );
                    })
                    .onError((err) => reject(err)).start();
            }
        );
    }

    public static find(id: string | number) {
        const that = this;
        return new Promise<SingularResponse>(
            (resolve, reject) => {
                that.find$(id)
                    .onSuccess(
                        (data) => {
                            resolve(new SingularResponse(
                                that.query$().getBuilder().getQuery(),
                                new AngularHttpClientResponse(new HttpResponse()), that, data));
                        }
                    )
                    .onError((err) => reject(err)).start();
            }
        );
    }

    static query() {
        return new CustomBuilder(this);
    }

    static with(attribute: any) {
        return new CustomBuilder(this).with(attribute);
    }

    static limit(limit: number) {
        return new CustomBuilder(this).limit(limit);
    }

    static where(attribute: string, value: string) {
        return new CustomBuilder(this).where(attribute, value);
    }

    static orderBy(attribute: string, direction?: string) {
        return new CustomBuilder(this).orderBy(attribute, direction);
    }

    static option(queryParameter: string, value: any) {
        return new CustomBuilder(this).option(queryParameter, value);
    }*/
}
