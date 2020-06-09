import { Identity } from './identity';
import { ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';

@Identity.appendPolymorph('Person')
@ActionsContainer.hasEffects
export class Person extends Identity {
    jsonApiType: string = 'Person'
    protected static pageSize: number = 10
    get familyName () {
        return this.getAttribute('family_name')
    }

    set familyName (value) {
        this.setAttribute('family_name', value)
    }

    get givenName () {
        return this.getAttribute('givenName')
    }
}