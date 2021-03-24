import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { EffectService } from "./ngrx/effects/effects.service";
import { GlobalEffects } from "./ngrx/effects/global.effects";
import { NGRX_COLOQUENT_ENTITY_KEY } from "./ngrx/reducers/entity-global/config";
import { GlobalEntityReducer } from "./ngrx/reducers/entity-global/global.reducer";
import { GlobalEntityService } from "./ngrx/reducers/entity-global/global.service";

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
export class NgrxColoquentGlobalModule {}
