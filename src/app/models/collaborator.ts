import { Attribut, toManyRelation, toOneRelation } from "@herlinus/coloquent";
import { Entities, Model } from "projects/ngrx-coloquent/src/models/models";

@Entities.hasReducer()
export class Identity extends Model {
    protected jsonApiType = 'Identity';

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

@Identity.appendPolymorph('Person')
export class Person extends Identity {
    protected jsonApiType = 'Person';

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

export class Dossier extends Model {
    protected jsonApiType = 'Dossier';

    @Attribut() NomDossier: string;

    public static getJsonApiBaseUrl() {
        return 'https://localhost:8000';
    }
}

@Identity.appendPolymorph('Collaborator')
export class Collaborator extends Person {
    protected jsonApiType = 'Collaborator';

    @toOneRelation(() => Dossier) client;

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

@Entities.hasReducer()
export class ClientContent extends Model {
    protected jsonApiType = 'ClientContent';

    @Attribut() client_id: number | string;

    @toOneRelation(() => Person) person;

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

@Entities.hasReducer()
export class NamedRule extends Model {
    protected jsonApiType = 'NamedRule';
    @Attribut() client_id: number | string;

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

@Entities.hasReducer()
export class StatementClientBinding extends Model {
    protected jsonApiType = 'StatementClientBinding';

    @Attribut() assignment_id: number | string;

    @Attribut() execution_context: string;

    @Attribut() active: number;

    @Attribut() named_rule_id: number | string;

    @toOneRelation(() => NamedRule) named_rule;

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

@Entities.hasReducer()
export class InputControl extends Model {
    protected jsonApiType = 'InputControl';

	@Attribut('id') __id__: number;
	@Attribut() key: string;
	@Attribut() context_id: number;
	@Attribut() default: string;
	@Attribut() widget: string;
	@Attribut() label: string;
	@Attribut() form: string;
	@Attribut() order: number;
	@Attribut() filter: string;

    @toManyRelation(() => ClientContent) client_contents;

    public static getJsonApiBaseUrl(): string {
        return 'https://localhost:8000';
    }
}

@Entities.hasReducer()
export class Sound extends Model {
    protected jsonApiType = 'sound';

    static customUrls = {
        getMany: 'sound/'
    };

    @Attribut() client_id: number;
    @Attribut() name: string;

    protected static paginationPageNumberParamName: string = 'number';

    protected static paginationPageSizeParamName: string = 'size';

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000';
    }
}