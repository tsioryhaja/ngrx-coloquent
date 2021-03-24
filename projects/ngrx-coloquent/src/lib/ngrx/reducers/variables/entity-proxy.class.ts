import { Model } from "@herlinus/coloquent";
import { EntityState } from "@ngrx/entity";
import { GlobalEntityState } from "../entity-global/global.reducer";

export abstract class BaseEntityProxy {
    abstract getValue(state: GlobalEntityState): Model | Model[];
}

export class EntityProxy implements BaseEntityProxy {
    jsonApiBaseType: string;
    entityId:   string | number;

    constructor(payload: Model | undefined | null) {
        if (payload) {
            this.jsonApiBaseType = payload.getJsonApiBaseType();
            this.entityId = payload.getApiId();
        }
    }

    getValue(state: GlobalEntityState) {
        if (!this.jsonApiBaseType) {
            return null;
        }
        const objectState: EntityState<Model> = state[this.jsonApiBaseType];
        return objectState ? objectState.entities[this.entityId] : null;
    }
}

export class MultipleEntityProxy {
    proxies: EntityProxy[];

    constructor(payloads: Model[]) {
        this.proxies = payloads.map((value: Model) => new EntityProxy(value)).filter(value => value ? true : false);
    }

    getValue(state: GlobalEntityState) {
        return this.proxies.map((proxy: EntityProxy) => proxy.getValue(state)).filter(value => value ? true : false);
    }
}

