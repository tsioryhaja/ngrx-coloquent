import { Attribute } from "@angular/core";
import { Attribut, toManyRelation, toOneRelation } from "@herlinus/coloquent";
import { AltEffectService } from "projects/ngrx-coloquent/src/effects/alt.effects.service";
import { Entities, Model } from "projects/ngrx-coloquent/src/models/models";
import { NumeroService } from "../services/sda/services";
import { SoundService } from "../services/sound/services";
import { SoundEffectService } from "./sound-service";

@Entities.hasReducer()
export class Identity extends Model {
    protected jsonApiType = 'Identity';

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000/api';
    }
}

@Identity.appendPolymorph('Person')
export class Person extends Identity {
    protected jsonApiType = 'Person';

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000/api';
    }
}

export class Dossier extends Model {
    protected jsonApiType = 'Dossier';

    @Attribut() NomDossier: string;

    public static getJsonApiBaseUrl() {
        return 'http://localhost:8000/api';
    }
}

@Identity.appendPolymorph('Collaborator')
export class Collaborator extends Person {
    protected jsonApiType = 'Collaborator';

    @toOneRelation(() => Dossier) client;

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000/api';
    }
}

@Entities.hasReducer()
export class ClientContent extends Model {
    protected jsonApiType = 'ClientContent';

    @Attribut() client_id: number | string;

    @toOneRelation(() => Person) person;

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000/api';
    }
}

@Entities.hasReducer()
export class NamedRule extends Model {
    protected jsonApiType = 'NamedRule';
    @Attribut() client_id: number | string;

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000/api';
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
        return 'http://localhost:8000/api';
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
        return 'http://localhost:8000/api';
    }

    static serviceInjection = AltEffectService;
}

@Entities.hasReducer()
export class Sound extends Model {
    protected jsonApiType = 'Sound';

    static serviceInjection = SoundEffectService;
    static customService = SoundService;

    @Attribut() client_id: number;
    @Attribut() name: string;

    protected static paginationPageNumberParamName: string = 'number';

    protected static paginationPageSizeParamName: string = 'size';

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000';
    }
}

@Entities.hasReducer()
export class Numero extends Model {
    protected jsonApiType = 'Numero';

    static serviceInjection = SoundEffectService;
    static customService = NumeroService;

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000';
    }

    @Attribut() provider_id: number;
    @Attribut() phone_number: string;
    @Attribut() area_code: number;
    @Attribut() state: string;
    @Attribut() old_state: string;
    @Attribut('type') __type: string;
    @Attribut() distribution: boolean;
    @Attribut() domiciliation: boolean;
    @Attribut() domiciliation_date: string;
    @Attribut() folder_id: number;
    @Attribut() old_folder_id: number;
    @Attribut() state_change_date: string;
    @Attribut() creation_date: string;
    @Attribut() company_id: number;

    protected static paginationPageNumberParamName: string = 'number';

    protected static paginationPageSizeParamName: string = 'size';
}

@Entities.hasReducer()
export class SearchDossier extends Model {
    protected jsonApiType = 'SearchDossier';

    public static getJsonApiBaseUrl(): string {
        return 'http://localhost:8000/api';
    }

    @Attribut() NomDossier: string;
}