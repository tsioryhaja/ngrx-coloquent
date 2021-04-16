import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";
import { AngularHttpClient } from "./ngrx/http-client/class";
import { Entities, Model } from "./ngrx/reducers/entity-global/models";
import { EffectService } from "./ngrx/effects/effects.service";
import { GlobalEffects } from "./ngrx/effects/global.effects";
import { NGRX_COLOQUENT_ENTITY_KEY } from "./ngrx/reducers/entity-global/config";
import { GlobalEntityReducer } from "./ngrx/reducers/entity-global/global.reducer";
import { GlobalEntityService } from "./ngrx/reducers/entity-global/global.service";
import { reducerFirstInit } from "./ngrx/reducers/entity-global/global-reducers.actions";

@NgModule({
    declarations: [],
    imports: [
      HttpClientModule,
      StoreModule.forFeature(NGRX_COLOQUENT_ENTITY_KEY, GlobalEntityReducer),
      EffectsModule.forFeature([GlobalEffects])
    ],
    providers: [GlobalEntityService, EffectService],
    bootstrap: []
})
export class NgrxColoquentGlobalModule {
  constructor(httpClient: HttpClient, store: Store) {
    const angularHttpClient = new AngularHttpClient(httpClient);
    Model.setBaseHttpClient(angularHttpClient);
    store.dispatch(reducerFirstInit({ entityStateKeys: Entities.jsonapiReducers }));
  }
}
