import { BaseJsonAPIService } from 'projects/ngrx-coloquent/src/public-api';
import { Collaborator} from '../models/collaborator';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CollaboratorService extends BaseJsonAPIService<Collaborator> {
    resource = Collaborator
    resourceType = 'Collaborator'
}