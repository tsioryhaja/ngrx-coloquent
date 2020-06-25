import { StoreModule } from '@ngrx/store';
import { variableReducer } from './ngrx/base.entity.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NgrxColoquentConfigService, BaseNgrxColoquentConfigService } from './ngrx/config';
import { REDUCER_TOKEN, FEATURE_CONFIG_TOKEN } from './module-injector';
import { NgModule } from '@angular/core';
import { VariablesService } from './ngrx/variable.service';


export const storeConfig = {
  runtimeChecks: {
    strictActionSerializability: false,
    strictStateImmutability: false,
    strictStateSerializability: false,
    strictActionImmutability: false
  }
}

@NgModule({
  declarations: [
  ],
  imports: [
    StoreModule.forRoot(REDUCER_TOKEN, storeConfig)
  ],
  providers: [VariablesService],
  bootstrap: []
})
export class NgrxColoquentModule {
  static forRoot(reducers: any) {
    return {
      ngModule: NgrxColoquentModule,
      providers: [
        {
          provide: BaseNgrxColoquentConfigService,
          useValue: new NgrxColoquentConfigService({isInFeature: false, reducers: reducers, featureName: null})
        }
      ]
    }
  }
}

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [VariablesService],
  bootstrap: []
})
export class CustomStoreModule {
  static forFeature(reducers: any) {
    return StoreModule.forFeature('ngrxcoloquent', reducers)
  }
}

@NgModule({
  declarations: [
  ],
  imports: [
    StoreModule.forFeature('ngrxcoloquent', REDUCER_TOKEN, FEATURE_CONFIG_TOKEN)
  ],
  providers: [VariablesService],
  bootstrap: []
})
export class NgrxColoquentFeatureModule {
  static forFeature(reducers: any) {
    return {
      ngModule: NgrxColoquentFeatureModule,
      providers: [
        {
          provide: BaseNgrxColoquentConfigService,
          useValue: new NgrxColoquentConfigService(
            {
              isInFeature: true, featureName: 'ngrxcoloquent', reducers: reducers
            }
          )
        }
      ]
    }
  }
}