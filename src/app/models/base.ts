import { Model as Model_, PolymorphicModel as PolymorphicModel_, PaginationStrategy } from '@herlinus/coloquent';

export abstract class Model extends Model_ {
    protected static paginationStrategy: PaginationStrategy = PaginationStrategy.PageBased
    protected static paginationPageNumberParamName: string = 'page[number]'
    protected static paginationPageSizeParamName: string = 'page[size]'

    getJsonApiBaseUrl(): string {
        return 'http://192.168.56.102:7500/api/'
    }
}

export abstract class PolymorphicModel extends PolymorphicModel_ {
    protected static paginationStrategy: PaginationStrategy = PaginationStrategy.PageBased
    protected static paginationPageNumberParamName: string = 'page[number]'
    protected static paginationPageSizeParamName: string = 'page[size]'

    getJsonApiBaseUrl(): string {
        return 'http://192.168.56.102:7500/api/'
    }
}