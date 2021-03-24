import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgrxColoquentModule, ActionsContainer, NgrxColoquentFeatureModule, variableReducer, storeConfig, NgrxColoquentGlobalModule } from 'projects/ngrx-coloquent/src/public-api';
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
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    NgrxColoquentGlobalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
