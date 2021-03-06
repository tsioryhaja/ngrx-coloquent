import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";
import { AngularHttpClient } from "../http-client/class";
import { Entities, Model } from "../models/models";
import { EffectService } from "../effects/effects.service";
import { GlobalEffects } from "../effects/global.effects";
import { NGRX_COLOQUENT_ENTITY_KEY } from "../reducers/config";
import { GlobalEntityReducer } from "../reducers/global.reducer";
import { GlobalEntityService } from "../reducers/global.service";
import { reducerFirstInit } from "../reducers/global-reducers.actions";
import { NgrxColoquentBaseError } from "../effects/errors";

@NgModule({
    declarations: [],
    imports: [
      HttpClientModule,
      StoreModule.forFeature(NGRX_COLOQUENT_ENTITY_KEY, GlobalEntityReducer),
      EffectsModule.forFeature([GlobalEffects, NgrxColoquentBaseError])
    ],
    providers: [GlobalEntityService, EffectService],
    bootstrap: []
})
export class NgrxColoquentGlobalModule {
  constructor(httpClient: HttpClient, store: Store, service: GlobalEntityService) {
    Model.ngrxColoquentService = service;
    const angularHttpClient = new AngularHttpClient(httpClient);
    Model.setBaseHttpClient(angularHttpClient);
    store.dispatch(reducerFirstInit({ entityStateKeys: Entities.jsonapiReducers }));
  }
}
