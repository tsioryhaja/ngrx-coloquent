import { Component, OnInit } from '@angular/core';
import { GlobalEntityService } from 'projects/ngrx-coloquent/src/public-api';
import { Observable } from 'rxjs';
import { Identity, Person } from '../models/collaborator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  collaborator: Observable<Identity> = this.service.selectEntity(
    (state) => {
      console.log(state);
      return state['500245'];
    },
    Identity
  )
  
  constructor(private service: GlobalEntityService) {}

  ngOnInit(): void {
    console.log(Object.getPrototypeOf(Identity));
    console.log(Person.getModelKeys());
    this.collaborator.subscribe(
      (data) => {
        if (data) console.log(Object.getPrototypeOf(data));
        if (data) {
          console.log(data.getApiId());
        }
      }
    );
    this.service.loadOne$(Identity, '500245');
  }

  
}
