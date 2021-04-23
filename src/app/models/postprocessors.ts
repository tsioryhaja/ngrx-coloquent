import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Model } from "projects/ngrx-coloquent/src/models/models";
import { NgrxColoquentGlobalEffectsPostprocessesInterface } from "ngrx-coloquent";

@Injectable()
export class FirstPostProcessors implements NgrxColoquentGlobalEffectsPostprocessesInterface {
    loadMany(data: Model[], response: HttpResponse<any>) {
        console.log(response);
        return data;
    }
}