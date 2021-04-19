import { not } from "@angular/compiler/src/output/output_ast";
import { Builder, SortDirection } from "@herlinus/coloquent";
import { FilterSpec } from "@herlinus/coloquent/dist/FilterSpec";
import { EntityActionParameters } from "ngrx-coloquent";

export class StartPromise {
    constructor(public startMethod: any) {
    }
    successFunction: any = null;
    errorFunction: any = null;
    startedFunction: any = null;
    startFunction() {
        const that = this;
        this.startedFunction = setTimeout(
            () => {
                const parameters: EntityActionParameters = {
                    onSuccess: that.successFunction,
                    onFailure: that.errorFunction
                };
                that.startMethod(parameters);
            },
            200
        );
    }

    start() {
        this.startFunction();
    }

    then(success: any) {
        this.successFunction = success;
        if (this.startedFunction) {
            clearTimeout(this.startedFunction);
            this.startedFunction = null;
        } 
        this.startFunction();
        return this;
    }

    error(error: any) {
        this.errorFunction = error;
        if (this.startedFunction) {
            clearTimeout(this.startedFunction);
            this.startedFunction = null;
        } 
        this.startFunction();
        return this;
    }
}

export class QueryBuilder {
    customForceSingular: boolean;
    builder: Builder;

    constructor(
        public modelType: any,
        queriedRelationName: string | undefined = undefined,
        baseModelJsonApiType: string | undefined = undefined,
        baseModelJsonApiId: string | undefined = undefined,
        forceSingular: boolean = false
    ) {
        this.customForceSingular = forceSingular;
        this.builder = new Builder(
            modelType,
            queriedRelationName,
            baseModelJsonApiType,
            baseModelJsonApiId,
            forceSingular
        );
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
        return new StartPromise((parameters: EntityActionParameters) => {
            that.loadMany$(page, parameters, includedRelationships);
        });
    }

    first(includedRelationships: string[] = []) {
        const that = this;
        return new StartPromise((parameters: EntityActionParameters) => {
            that.builder.getQuery().getPaginationSpec().setPageLimit(1);
            that.loadMany$(0, parameters, includedRelationships);
        });
    }
}
