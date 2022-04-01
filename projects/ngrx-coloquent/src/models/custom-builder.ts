import { Builder, PluralResponse, SingularResponse, SortDirection } from "@herlinus/coloquent";
import { FilterSpec } from "@herlinus/coloquent";
import { Query } from "@herlinus/coloquent";
import { Model } from "./models";

export class CustomBuilder extends Builder {
    protected _forceSingular: boolean;
    constructor(modelType: typeof Model,
        queriedRelationName: string | undefined = undefined,
        baseModelJsonApiType: string | undefined = undefined,
        baseModelJsonApiId: string | undefined = undefined,
        forceSingular: boolean = false) {
            super(modelType,
                queriedRelationName,
                baseModelJsonApiType,
                baseModelJsonApiId,
                forceSingular);
            this._forceSingular = forceSingular;
        }
    
    __clone() {
        let clone = Object.create(this);
        return this.copyThisTo(clone);
    }

    copyThisTo(clone) {
        let query = new Query(this.getQuery().getJsonApiType(), this.getQuery().getQueriedRelationName(), this.getQuery().getJsonApiId());

        this.getQuery().getFilters().forEach(filter => query.addFilter(filter));
        this.getQuery().getOptions().forEach(option => query.addOption(option));
        this.getQuery().getSort().forEach(sort => query.addSort(sort));
        this.getQuery().getInclude().forEach(include => query.addInclude(include));

        query.setPaginationSpec(Object.create(this.getQuery().getPaginationSpec()));
        const limit = this.getQuery().getLimit();
        if(limit !== undefined) {
            query.setLimit(limit);
        }
        clone.setQuery(query);
        return clone;
    }

    buildBaseBuilder() {
        const clone = new Builder(this.modelType, this.getQuery().getQueriedRelationName(), this.getQuery().getJsonApiType(), this.getQuery().getJsonApiId(), this._forceSingular);
        return this.copyThisTo(clone);
    }

    __get(page: number = 1) {
        return super.get(page);
    }

    get(page: number = 1): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.modelType.loadMany$(
                    this.buildBaseBuilder(),
                    page,
                    {
                        onSuccess: (data) => {
                            resolve(new PluralResponse(this.getQuery(), null, this.modelType, data, page));
                        },
                        onErrror: (err) => {
                            reject(err);
                        }
                    }
                );
            }
        );
    }

    __find(id: string | number) {
        return super.find(id);
    }

    find(id: string | number): Promise<any> {
        const clone = this.__clone();
        clone.getQuery().setIdToFind(id);
        return new Promise(
            (resolve, reject) => {
                this.modelType.loadMany$(
                    clone.buildBaseBuilder(),
                    1,
                    {
                        onSuccess: (data) => {
                            data = Array.isArray(data) ? data.length ? data[0] : null : data;
                            resolve(new SingularResponse(this.getQuery(), null, this.modelType, data));
                        },
                        onErrror: (err) => {
                            reject(err);
                        }
                    }
                );
            }
        );
    }

    where(attribute: string, value: any) {
        const clone = this.__clone();
        const _clone = super.where(attribute, value);
        clone.setQuery(_clone.getQuery());
        return clone;
    }

    with(value: any) {
        const clone = this.__clone();
        const _clone = super.with(value);
        clone.setQuery(_clone.getQuery());
        return clone;
    }

    orderBy(attribute: string, direction?: SortDirection|string) {
        const clone = this.__clone();
        const _clone = super.orderBy(attribute, direction);
        clone.setQuery(_clone.getQuery());
        return clone;
    }

    option(queryParameter: string, value: string) {
        const clone = this.__clone();
        const _clone = super.option(queryParameter ,value);
        clone.setQuery(_clone.getQuery());
        return clone;
    }
}
