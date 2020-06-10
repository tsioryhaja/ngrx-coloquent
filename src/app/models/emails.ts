import { Model } from './base';
import { ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';

@ActionsContainer.hasReducer
export class Email extends Model {
    jsonApiType: string = 'Email'
}