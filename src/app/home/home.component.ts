import { Component, OnInit } from '@angular/core';
import { GlobalEntityService } from 'projects/ngrx-coloquent/src/public-api';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { ClientContent, Collaborator, Identity, Person } from '../models/collaborator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterData: Subject<any> = new BehaviorSubject<any>(0);
  collaborator: Observable<Identity> = Identity.selectEntity$(
    (state, filterData) => {
      console.log(filterData)
      console.log(state);
      return state['500245'];
    },
    [
      this.filterData.asObservable()
    ]
  );
  
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
    Collaborator.find$('500245', ['emails']).onSuccess((data) => console.log(data)).start();
    ClientContent.query$().get(1).onSuccess(
      (data) => {
        const d: ClientContent = data[0];
        d.loadRelation$('person').onSuccess(
          (pers) => {
            console.log(pers);
            console.log(d.getRelation('person'));
          }
        ).start();
      }
    ).start();
    Identity.query$().with('client').get()
      .onSuccess(
        () => console.log('done')
      ).onError(
        () => console.error('ERROR')
      ).start();

    Identity.loadNext('identity', [
      {
        key: 'with',
        value: ['client']
      }
    ]).onSuccess(
      (data) => {
        console.log(data);
      }
    )
    .onError(
      (data) => {
        console.log(data);
      }
    )
    .start()
  }

}
