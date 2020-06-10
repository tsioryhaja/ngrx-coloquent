import { Injectable } from "@angular/core";
import { BaseEffects } from 'ngrx-coloquent';
import { EmailService } from './email.service';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Email } from '../models/emails';

@Injectable()
export class EmailEffects extends BaseEffects {
    constructor(service: EmailService, actions$: Actions, store: Store<Email>) {
        super(service, actions$, store)
    }
}