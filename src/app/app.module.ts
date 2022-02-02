import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgrxColoquentGlobalModule, NgrxColoquentVariableModule } from 'projects/ngrx-coloquent/src/public-api';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInjector, TokenInterceptor } from './models/token.interceptor';
import { FirstFilterPreprocessors } from './models/preprocessors';
import { FirstPostProcessors } from './models/postprocessors';
import { ApiModule } from './services/sound/api.module';
import { ApiModule as SDAApiModule } from './services/sda/api.module';

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
    ApiModule.forRoot({rootUrl: 'http://localhost:8000'}),
    SDAApiModule.forRoot({rootUrl: 'http://localhost:8000'}),
    StoreModule.forRoot({}, storeConfig),
    EffectsModule.forRoot([]),
    NgrxColoquentGlobalModule,
    NgrxColoquentVariableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
