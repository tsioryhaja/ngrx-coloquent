import { Identity } from './identity';
import { ActionsContainer } from 'projects/ngrx-coloquent/src/public-api';
import { ToManyRelation } from '@herlinus/coloquent';
import { Email } from './emails';

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
        return this.getAttribute('given_name')
    }

    emails(): ToManyRelation {
        return this.hasMany(Email)
    }

    getEmails(): Email[] {
        return this.getRelation('emails')
    }

    //readOnlyAttributes = ['display_name']
}