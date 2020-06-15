import { Injectable } from "@angular/core";
import { Email } from '../models/emails';
import { BaseJsonAPIService } from 'projects/ngrx-coloquent/src/public-api';

@Injectable({
    providedIn: 'root'
})
export class EmailService extends BaseJsonAPIService<Email> {
    resource = Email
    resourceType= 'Email'
}