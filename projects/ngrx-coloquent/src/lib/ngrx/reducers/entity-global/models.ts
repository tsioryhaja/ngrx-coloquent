import { HttpClient, Model as Model_, PaginationStrategy, PolymorphicModel as PolymorphicModel_ } from '@herlinus/coloquent';
import { AngularHttpClient } from '../../http-client/class';

export abstract class PolymorphicModel extends PolymorphicModel_ {
    protected static paginationStrategy = PaginationStrategy.PageBased;
    static baseUrl: string = null;

    static setGlobalHttpClient (httpClient: HttpClient) {
        this._httpClient['.'] = httpClient;
    }

    static get httpClient(): HttpClient {
        let httpClient = this._httpClient[this.getJsonApiBaseUrl()];
        if (!httpClient) {
            const newHttpClient = new AngularHttpClient();
            newHttpClient.setBaseUrl(this.getJsonApiBaseUrl());
            this._httpClient[this.getJsonApiBaseUrl()] = newHttpClient;
            httpClient = newHttpClient;
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

    static setGlobalHttpClient (httpClient: HttpClient) {
        this._httpClient['.'] = httpClient;
    }

    static get httpClient(): HttpClient {
        let httpClient = this._httpClient[this.getJsonApiBaseUrl()];
        if (!httpClient) {
            const newHttpClient = new AngularHttpClient();
            newHttpClient.setBaseUrl(this.getJsonApiBaseUrl());
            this._httpClient[this.getJsonApiBaseUrl()] = newHttpClient;
            httpClient = newHttpClient;
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
