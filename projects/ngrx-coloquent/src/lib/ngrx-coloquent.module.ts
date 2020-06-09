import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { NgrxColoquentComponent } from './ngrx-coloquent.component';
import { StoreModule, Action, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { variableReducer } from './ngrx/base.entity.reducer';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';


export const storeConfig = {
  runtimeChecks: {
    strictActionSerializability: false,
    strictStateImmutability: false,
    strictStateSerializability: false,
    strictActionImmutability: false
  }
}


@NgModule({
  declarations: [NgrxColoquentComponent],
  imports: [
    BrowserModule
  ],
  exports: [NgrxColoquentComponent]
})
export class NgrxColoquentModule {
}
