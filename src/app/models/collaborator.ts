import { Model } from "projects/ngrx-coloquent/src/lib/ngrx/reducers/entity-global/models";

export class Identity extends Model {
    protected jsonApiType = 'Identity';

    public static getJsonApiBaseUrl(): string {
        return 'https://sara-dev.absys.fr/api';
    }
}