import { Builder } from "@herlinus/coloquent";
import { Query } from "@herlinus/coloquent";
import { QueryBuilder } from "../query-builder";
import { AngularQuery } from "./query";

export class AngularBuilder extends Builder {
    customUrl: string | undefined = undefined;

    constructor(modelType: any,
        queriedRelationName: string | undefined = undefined,
        baseModelJsonApiType: string | undefined = undefined,
        baseModelJsonApiId: string | undefined = undefined,
        forceSingular: boolean = false,
         customUrl: string | undefined = undefined
    ) {
        super(
            modelType,
            queriedRelationName,
            baseModelJsonApiType,
            baseModelJsonApiId,
            forceSingular);
        if (customUrl) {
            this.customUrl = customUrl;
            this.setQuery(this.getQuery());
        }
    }

    public setQuery(query: Query) {
        super.setQuery(this.fromQuery(query));
    }

    rebuildBuilder(baseName: string) {
        const model = this.modelType;
        const newQ: QueryBuilder = model.query$();

        this.setQuery(this.getQuery());

        newQ.setBuilder(this);

        const relationName = this.getQuery().getQueriedRelationName();
        const jsonApiId = this.getQuery().getJsonApiId();
        const m = new model();

        const customUrlName = m.getJsonApiType() + '.' + baseName + (relationName ? '_' + relationName : '');

        if (model.customUrls[customUrlName]) {
            let customUrl = model.customUrls[customUrlName];
            if (relationName) {
                customUrl = customUrl.replace('{jsonApiId}', jsonApiId);
            }
            newQ.setCustomUrl(customUrl);
        }
        return newQ
    }

    public get(page: number = 1): Promise<any> {
        const newQ = this.rebuildBuilder('getMany');
        
        return new Promise((resolve, reject) => {
            newQ.get(page)
                .onSuccess(
                    (s, r) => {
                        resolve(r);
                    }
                )
                .start();
        });
    }

    public find(id): Promise<any> {
        const newQ = this.rebuildBuilder('getOne');
        
        return new Promise((resolve, reject) => {
            newQ.find('' + id)
                .onSuccess(
                    (s, r) => {
                        resolve(r);
                    }
                )
                .start();
        });
    }

    first(): Promise<any> {
        const newQ = this.rebuildBuilder('getMany');
        
        return new Promise((resolve, reject) => {
            newQ.first()
                .onSuccess(
                    (s, r) => {
                        resolve(r);
                    }
                )
                .start();
        });
    }

    public __get(page: number = 1) {
        return super.get(page);
    }

    public __find(id) {
        return super.find(id);
    }

    public __first() {
        return super.first();
    }

    fromQuery(q: Query) {
        const query = new AngularQuery(q.getJsonApiType(), q.getQueriedRelationName(), q.getJsonApiId());

        if (this.customUrl) {
            query.customUrl = this.customUrl;
        }

        q.getFilters().forEach(filter => query.addFilter(filter));
        q.getOptions().forEach(option => query.addOption(option));
        q.getSort().forEach(sort => query.addSort(sort));
        q.getInclude().forEach(include => query.addInclude(include));

        query.setPaginationSpec(Object.create(q.getPaginationSpec()));

        const limit = q.getLimit();
        if (limit !== undefined)
        {
            query.setLimit(limit);
        }

        if (this.customUrl) {
            query.customUrl = this.customUrl;
        }

        return query;
    }

    getModelType() {
        return this.modelType;
    }
}
