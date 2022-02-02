import { Builder, SortDirection } from "@herlinus/coloquent";
import { EntityActionParameters } from "../ngrx/base.entity.class";
import { AngularBuilder } from "./query/builder";


function _executeFuntion (data: any, functionList: any[] = []) {
    if (functionList.length) {
        for (const func of functionList) {
            const tempData = func(data[0], data[1]);
            data = tempData ? tempData : data;
        }
    }
}
export class StartPromise {
    constructor(public startMethod: any) {
    }
    successFunction: any[] = [];
    errorFunction: any[] = [];
    startedFunction: any = null;
    variableName: string = null;
    startFunction() {
        const that = this;
        /*this.startedFunction = setTimeout(
            () => {*/
        const parameters: EntityActionParameters = {
            onSuccess: this.executeFunction(this.successFunction),
            onFailure: this.executeFunction(this.errorFunction),
            variableName: this.variableName && this.variableName !== '' ? this.variableName : null
        };
        that.startMethod(parameters);
            /*},
            200
        );*/
    }

    executeFunction(functionList) {
        return (data: any, response: any) => {
            _executeFuntion([data, response], functionList);
        }
    }

    start(success: any = null, error: any = null) {
        if (success) this.onSuccess(success);
        if (error) this.onSuccess(error);
        this.startFunction();
    }

    onSuccess(success: any) {
        this.successFunction.push(success);
        /*if (this.startedFunction) {
            clearTimeout(this.startedFunction);
            this.startedFunction = null;
        } 
        this.startFunction();*/
        return this;
    }

    onError(error: any) {
        this.errorFunction.push(error);
        /*if (this.startedFunction) {
            clearTimeout(this.startedFunction);
            this.startedFunction = null;
        } 
        this.startFunction();*/
        return this;
    }

    inVariable(variableName: string) {
        this.variableName = variableName;
        return this;
    }
}

export class QueryBuilder {
    customForceSingular: boolean;
    builder: Builder;
    customUrl: string;

    constructor(
        public modelType: any,
        queriedRelationName: string | undefined = undefined,
        baseModelJsonApiType: string | undefined = undefined,
        baseModelJsonApiId: string | undefined = undefined,
        forceSingular: boolean = false
    ) {
        this.customForceSingular = forceSingular;
        this.builder = new AngularBuilder(
            modelType,
            queriedRelationName,
            baseModelJsonApiType,
            baseModelJsonApiId,
            forceSingular
        );
    }

    setCustomUrl(url: string) {
        this.customUrl = url;
        this.builder = this.fromBuilder(this.builder);
    }

    fromBuilder(builder: Builder): AngularBuilder {
        const newB = new AngularBuilder(
            this.modelType,
            builder.getQuery().getQueriedRelationName(),
            builder.getQuery().getJsonApiType(),
            builder.getQuery().getJsonApiId(),
        );

        if (this.customUrl) {
            newB.customUrl = this.customUrl;
        }

        newB.setQuery(builder.getQuery());
        return newB;
    }

    getBuilder() {
        return this.builder;
    }

    setBuilder(builder: Builder) {
        this.builder = builder;
        return this;
    } 

    clone(): QueryBuilder {
        return Object.create(this);
    }

    loadMany$(page: number = 1, parameters: EntityActionParameters = {}, includedRelationships: string[] = []) {
        this.modelType.loadMany$(this.builder, page, parameters, includedRelationships);
    }

    findOne$(id: number | string, parameters: EntityActionParameters = {}) {
        this.modelType.findOne$(id, this.builder, parameters);
    }

    limit(limit: number): QueryBuilder {
        const clone = this.clone();
        return clone.setBuilder(this.builder.limit(limit));
    }

    where(attribute: string, value: string) {
        const clone = this.clone();
        return clone.setBuilder(this.builder.where(attribute, value));
    }

    with(value: any) {
        const clone = this.clone();
        return clone.setBuilder(this.builder.with(value));
    }

    orderBy(attribute: string, direction?: SortDirection|string) {
        const clone = this.clone();
        return clone.setBuilder(this.builder.orderBy(attribute, direction));
    }

    option(queryParameter: string, value: string) {
        const clone = this.clone();
        return clone.setBuilder(this.builder.option(queryParameter, value));
    }

    get(page: number = 1, includedRelationships: string[] = []): StartPromise {
        const that = this;
        const b: AngularBuilder = <AngularBuilder> this.builder;
        return new StartPromise((parameters: EntityActionParameters) => {
            b.rebuildBuilder('getMany').loadMany$(page, parameters, includedRelationships);
        });
    }

    find(id): StartPromise {
        const that = this;
        const b: AngularBuilder = <AngularBuilder> this.builder;
        return new StartPromise((parameters: EntityActionParameters) => {
            b.rebuildBuilder('getOne').findOne$(id, parameters);
        })
    }

    first(includedRelationships: string[] = []) {
        const that = this;
        const b: AngularBuilder = <AngularBuilder> this.builder;
        return new StartPromise((parameters: EntityActionParameters) => {
            that.builder.getQuery().getPaginationSpec().setPageLimit(1);
            b.rebuildBuilder('getMany').loadMany$(0, parameters, includedRelationships);
        });
    }
}
