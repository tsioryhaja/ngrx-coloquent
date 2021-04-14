import { HttpClient, Model as Model_, PaginationStrategy, PolymorphicModel as PolymorphicModel_ } from '@herlinus/coloquent';
import { AngularHttpClient } from '../../http-client/class';

export abstract class PolymorphicModel extends PolymorphicModel_ {
    protected static paginationStrategy = PaginationStrategy.PageBased;
    static baseUrl: string = null;

    static setGlobalHttpClient (httpClient: HttpClient) {
        this._httpClient['.'] = httpClient;
    }

    static setBaseHttpClient(httpClient: AngularHttpClient) {
        this._httpClient['angular-http-client'] = httpClient;
    }

    static get httpClient(): HttpClient {
        let httpClient = this._httpClient[this.getJsonApiBaseUrl()];
        if (!httpClient && this._httpClient['angular-http-client']) {
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
}

export abstract class Model extends Model_ {
    protected static paginationStrategy = PaginationStrategy.PageBased;
    static baseUrl: string = null;

    constructor() {
        super();
        Model._httpClient[this.getJsonApiBaseUrl()] = null;
    }

    static setGlobalHttpClient (httpClient: HttpClient) {
        this._httpClient['.'] = httpClient;
    }

    static setBaseHttpClient(httpClient: AngularHttpClient) {
        this._httpClient['angular-http-client'] = httpClient;
    }

    static get httpClient(): HttpClient {
        let httpClient = this._httpClient[this.getJsonApiBaseUrl()];
        console.log(this._httpClient);
        if (!httpClient && this._httpClient['angular-http-client']) {
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
}
