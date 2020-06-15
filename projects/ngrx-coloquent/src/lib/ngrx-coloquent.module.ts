import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { NgrxColoquentComponent } from './ngrx-coloquent.component';
import { StoreModule, Action, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { variableReducer, ReducerContainer } from './ngrx/base.entity.reducer';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ActionsContainer } from './ngrx/base.entity.actions';


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