import { Injectable } from "@angular/core";
import { BaseJsonAPIService } from 'ngrx-coloquent';
import { Email } from '../models/emails';

@Injectable({
    providedIn: 'root'
})
export class EmailService extends BaseJsonAPIService<Email> {
    resource = Email
    resourceType= 'Email'
}