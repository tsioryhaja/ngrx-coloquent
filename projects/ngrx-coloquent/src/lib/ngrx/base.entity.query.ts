import { BaseJsonAPIService } from './base.entity.class';
import { Model as AppModel } from '@herlinus/coloquent';
import { Builder, SortDirection } from '@herlinus/coloquent';

export interface GetQuery {
    page?: number
    variableName?: string 
}

export class BaseQuery {
    constructor(private service: BaseJsonAPIService<AppModel>, private query: Builder) {
    }
    limit(limit: number) {
        this.query = this.query.limit(limit)
    }
    where(attribute: string, value: string) {
        this.query = this.query.where(attribute, value)
    }
    with(value: any) {
        this.query = this.query.with(value)
    }
    orderBy(attribute: string, direction?: SortDirection | string) {
        this.query = this.query.orderBy(attribute, direction)
    }
    option(queryParameter: string, value: string) {
        this.query = this.query.option(queryParameter, value)
    }
    getBuilder() {
        return this.query
    }
    get(parameter: GetQuery) {
        if (parameter.variableName) this.service.loadMany$(this.query, parameter.page, { variableName: parameter.variableName })
        else this.service.loadMany$(this.query, parameter.page)
    }
}