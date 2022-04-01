import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Inject, NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";
import { AngularHttpClient } from "../models/http-client/class";
import { Entities, Model } from "../models/models";
import { EffectService } from "../effects/effects.service";
import { GlobalEffects } from "../effects/global.effects";
import { NGRX_COLOQUENT_ENTITY_KEY } from "../reducers/config";
import { GlobalEntityReducer } from "../reducers/global.reducer";
import { GlobalEntityService } from "../reducers/global.service";
import { reducerFirstInit } from "../reducers/global-reducers.actions";
import { NgrxColoquentBaseError } from "../effects/errors";
import { AltEffectService } from "../effects/alt.effects.service";

@NgModule({
    declarations: [],
    imports: [
      HttpClientModule,
      StoreModule.forFeature(NGRX_COLOQUENT_ENTITY_KEY, GlobalEntityReducer),
      EffectsModule.forFeature([GlobalEffects, NgrxColoquentBaseError])
    ],
    providers: [GlobalEntityService, EffectService, AltEffectService],
    bootstrap: []
})
export class NgrxColoquentGlobalModule {
  //constructor(@Inject(HttpClient) httpClient: HttpClient, @Inject(Store) store: Store, @Inject(GlobalEntityService) service: GlobalEntityService) {
  constructor(httpClient: HttpClient, store: Store, service: GlobalEntityService) {
    Model.ngrxColoquentService = service;
    const angularHttpClient = new AngularHttpClient(httpClient);
    Model.setBaseHttpClient(angularHttpClient);
    store.dispatch(reducerFirstInit({ entityStateKeys: Entities.jsonapiReducers }));
  }
}
