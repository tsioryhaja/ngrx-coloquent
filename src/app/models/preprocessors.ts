import { Injectable } from "@angular/core";
import { TypedAction } from "@ngrx/store/src/models";
import { GlobalVariableService } from "ngrx-coloquent";
import { EffectsLoadManyProps, NgrxColoquentGlobalEffectsPreprocessesInterface } from "projects/ngrx-coloquent/src/public-api";

@Injectable()
export class FirstFilterPreprocessors implements NgrxColoquentGlobalEffectsPreprocessesInterface {

    constructor(
    ) {
    }
    loadMany (action: EffectsLoadManyProps & TypedAction<"[JSONAPI/MODEL] Load Many">) {
        return action;
    }
}
