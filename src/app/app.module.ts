import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { variableReducer, storeConfig } from 'projects/ngrx-coloquent/src/public-api';
import { identityReducer } from './ngrx/identity.reducer';
import { PersonEffects } from './ngrx/person.effects';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({
      Identity: identityReducer,
      variables: variableReducer()
    }, storeConfig),
    EffectsModule.forRoot([PersonEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
