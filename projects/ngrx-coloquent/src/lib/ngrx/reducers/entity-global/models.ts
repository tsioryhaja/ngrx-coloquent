import { HttpClient, Model as Model_, PaginationStrategy, PolymorphicModel as PolymorphicModel_ } from '@herlinus/coloquent';
import { PolymorphicEntry, PolymorphicMapping } from '@herlinus/coloquent/dist/PolymorphicModel';
import { AngularHttpClient } from '../../http-client/class';

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


export abstract class Model extends Model_ {
    protected static paginationStrategy = PaginationStrategy.PageBased;
    static baseUrl: string = null;

    static polymorphicOn = null;

    static polymorphicChild: PolymorphicChildren = null;

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
}
