import { Person } from './person';
import { Identity } from './identity';
import { ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';

@Person.appendPolymorph('Collaborator')
@Identity.appendPolymorph('Collaborator')
@ActionsContainer.hasEffects
export class Collaborator extends Person {
    jsonApiType: string = 'Collaborator'
    protected static pageSize: number = 10
}