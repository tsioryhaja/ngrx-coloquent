import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgrxColoquentModule, ActionsContainer, NgrxColoquentFeatureModule, variableReducer, NgrxColoquentGlobalModule, NGRX_COLOQUENT_GLOBAL_EFFECTS_PREPROCESSES, NGRX_COLOQUENT_GLOBAL_EFFECTS_POSTPROCESSES } from 'projects/ngrx-coloquent/src/public-api';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './models/token.interceptor';
import { FirstFilterPreprocessors } from './models/preprocessors';
import { FirstPostProcessors } from './models/postprocessors';

const storeConfig = {
  runtimeChecks: {
    strictStateImmutability: false,
    strictActionImmutability: false,
    strictStateSerializability: false,
    strictActionSerializability: false
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, storeConfig),
    EffectsModule.forRoot([]),
    NgrxColoquentGlobalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: NGRX_COLOQUENT_GLOBAL_EFFECTS_PREPROCESSES,
      useClass: FirstFilterPreprocessors,
      multi: true
    },
    {
      provide: NGRX_COLOQUENT_GLOBAL_EFFECTS_POSTPROCESSES,
      useClass: FirstPostProcessors,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
