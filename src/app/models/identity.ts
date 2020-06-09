import { Model, PolymorphicModel } from './base';
import { ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';

@ActionsContainer.hasReducer
export class Identity extends PolymorphicModel {
    jsonApiType: string = 'Identity'
}