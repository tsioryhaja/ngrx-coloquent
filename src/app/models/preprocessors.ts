import { Injectable } from "@angular/core";
import { TypedAction } from "@ngrx/store/src/models";
import { EffectsLoadManyProps, NgrxColoquentGlobalEffectsPreprocessesInterface } from "projects/ngrx-coloquent/src/public-api";

@Injectable()
export class FirstFilterPreprocessors implements NgrxColoquentGlobalEffectsPreprocessesInterface {
    loadMany (action: EffectsLoadManyProps & TypedAction<"[JSONAPI/MODEL] Load Many">) {
        action.query = action.query.where('id', '500245');
        return action;
    }
}
