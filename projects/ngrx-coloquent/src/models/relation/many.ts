import { SortDirection, ToManyRelation } from "@herlinus/coloquent";
import { AngularBuilder } from "../query/builder";

export class AngularToManyRelation extends ToManyRelation {
    createAngularBuilder(isSingular: boolean) {
        return new AngularBuilder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), isSingular);
    }

    get(page?: number): Promise<any> {
        return this.createAngularBuilder(false).get(page);
    }

    first(): Promise<any> {
        return this.createAngularBuilder(false).first();
    }

    where(attribute: string, value: string) {
        return this.createAngularBuilder(false).where(attribute, value);
    }

    find(id: string | number) {
        return this.createAngularBuilder(false).find(id);
    }

    with(value: any) {
        return this.createAngularBuilder(false).with(value);
    }

    orderBy(attribute: string, direction?: string|SortDirection) {
        return this.createAngularBuilder(false).orderBy(attribute, direction);
    }

    option(queryParameter: string, value: string) {
        return this.createAngularBuilder(false).option(queryParameter, value);
    }
}
