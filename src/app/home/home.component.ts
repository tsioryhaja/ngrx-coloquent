import { Component, OnInit } from '@angular/core';
import { GlobalEntityService, GlobalVariableService } from 'projects/ngrx-coloquent/src/public-api';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { ClientContent, Collaborator, Identity, Person, Dossier } from '../models/collaborator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterData: Subject<any> = new BehaviorSubject<any>(0);
  /*collaborator: Observable<Identity> = Identity.selectEntity$(
    (state, filterData) => {
      console.log(filterData)
      console.log(state);
      return state['500245'];
    },
    [
      this.filterData.asObservable()
    ]
  );*/
  context: Observable<Dossier> = this.variable.getProxiedVariable('context');
  clientContent: Observable<ClientContent> = ClientContent.selectEntity$(
    (state, context) => {
      let filterState = [];
      if (context) {
        const contextId = parseInt(context.getApiId());
        console.log(typeof contextId);
        filterState = Object.values(state).filter((value: any) => {
          return value.client_id === contextId
        });
      }
      return filterState;
    },
    [
      this.context
    ]
  );
  
  constructor(private variable: GlobalVariableService) {}

  ngOnInit(): void {
    console.log(Object.getPrototypeOf(Identity));
    console.log(Person.getModelKeys());

    this.context.subscribe(
      (context) => {
        if (context) {
          ClientContent.loadNext(
            'test',
            []
          ).start();
        }
      }
    );

    Dossier.find$(500057).inVariable('context').start();

    /*this.collaborator.subscribe(
      (data) => {
        if (data) {
          console.log(Object.getPrototypeOf(data));
          console.log(data.getApiId());
        }
      }
    );*/
    //Collaborator.query().get().then((data) => console.log(data));
    //Collaborator.query().find(500246).then((data) => console.log(data));
    //this.service.loadOne$(Identity, '500245');
    /*Collaborator.find('500245').then(
      (data) => console.log(data)
    );*/
    /*ClientContent.query$().get(1).onSuccess(
      (data) => {
        const d: ClientContent = data[0];
        d.loadRelation$('person').onSuccess(
          (pers) => {
            console.log(pers);
            console.log(d.getRelation('person'));
          }
        ).start();
      }
    ).start();*/
    /*Identity.query$().with('client').get()
      .onSuccess(
        () => console.log('done')
      ).onError(
        () => console.error('ERROR')
      ).start();*/

    /*Identity.loadNext('identity', [
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
    .start();*/
  }

  loadNewFolder() {
    Dossier.find$(500092).inVariable('context').start();
  }

}
