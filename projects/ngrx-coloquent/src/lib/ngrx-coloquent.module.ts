import { StoreModule } from '@ngrx/store';
import { variableReducer } from './ngrx/base.entity.reducer';


export const storeConfig = {
  runtimeChecks: {
    strictActionSerializability: false,
    strictStateImmutability: false,
    strictStateSerializability: false,
    strictActionImmutability: false
  }
}

export class NgrxColoquentModule {
  static forRoot(reducers: any) {
    return StoreModule.forRoot(
      { variables: variableReducer(), ...reducers },
      storeConfig
    )
  }
}