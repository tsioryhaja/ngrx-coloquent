import { toOneRelation } from "@herlinus/coloquent";
import { Entities, Model } from "projects/ngrx-coloquent/src/models/models";

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

export class Dossier extends Model {
    protected jsonApiType = 'Dossier';

    public static getJsonApiBaseUrl() {
        return 'https://sera-dev.absys.fr/api';
    }
}

@Identity.appendPolymorph('Collaborator')
export class Collaborator extends Person {
    protected jsonApiType = 'Collaborator';

    @toOneRelation(() => Dossier) client;

    public static getJsonApiBaseUrl(): string {
        return 'https://sera-dev.absys.fr/api';
    }
}

export class ClientContent extends Model {
    protected jsonApiType = 'ClientContent';

    @toOneRelation(() => Person) person;

    public static getJsonApiBaseUrl(): string {
        return 'https://sera-dev.absys.fr/api';
    }
}