import { SingularResponse, SortDirection, ToOneRelation } from "@herlinus/coloquent";
import { AngularBuilder } from "../query/builder";

export class AngularToOneRelation extends ToOneRelation {
    protected createAngularBuilder(isSingular: boolean) {
        return new AngularBuilder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), isSingular);
    }

    get(page?: number): Promise<any> {
        return this.createAngularBuilder(true).get(page);
    }

    first(): Promise<any> {
        return this.createAngularBuilder(true).first();
    }

    where(attribute: string, value: string) {
        return this.createAngularBuilder(true).where(attribute, value);
    }

    find(id: string | number) {
        return this.createAngularBuilder(true).find(id);
    }

    with(value: any) {
        return this.createAngularBuilder(true).with(value);
    }

    orderBy(attribute: string, direction?: string|SortDirection) {
        return this.createAngularBuilder(true).orderBy(attribute, direction);
    }

    option(queryParameter: string, value: string) {
        return this.createAngularBuilder(true).option(queryParameter, value);
    }
}