import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgrxColoquentModule, ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';
import { PersonEffects } from './ngrx/person.effects';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CollaboratorEffects } from './ngrx/collaborator.effects';
import { EmailEffects } from './ngrx/email.effects';
import { identityReducer } from './ngrx/identity.reducer';
import { emailReducer } from './ngrx/email.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //StoreModule.forRoot({variables: variableReducer(ActionsContainer.getVarialbeAction()), Identity: identityReducer}),
    NgrxColoquentModule.forRoot({ Identity: identityReducer, Email: emailReducer }),
    EffectsModule.forRoot([PersonEffects, EmailEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
