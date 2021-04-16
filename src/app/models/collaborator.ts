import { Entities, Model } from "projects/ngrx-coloquent/src/lib/ngrx/reducers/entity-global/models";

@Entities.hasReducer()
export class Identity extends Model {
    protected jsonApiType = 'Identity';

    public static getJsonApiBaseUrl(): string {
        return 'https://sera-dev.absys.fr/api';
    }
}

@Identity.appendPolymorph('Person')
export class Person extends Identity {
    protected jsonApiType = 'Person';

    public static getJsonApiBaseUrl(): string {
        return 'https://sera-dev.absys.fr/api';
    }
}

@Identity.appendPolymorph('Collaborator')
export class Collaborator extends Person {
    protected jsonApiType = 'Collaborator';

    public static getJsonApiBaseUrl(): string {
        return 'https://sera-dev.absys.fr/api';
    }
}