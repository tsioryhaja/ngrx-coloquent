import { Component, OnInit } from '@angular/core';
import { PersonService } from '../ngrx/person.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Person } from '../models/person';
import { EmailService } from '../ngrx/email.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  collaborator: Observable<any> = this.emailService.getVariableData$('selectedCollaborator');
  all: Observable<any> = this.emailService.getVariableData$('testMany');
  collaborator1: Observable<any> = this.personService.getVariableData$('selectedCollaborator1');
  all1: Observable<any> = this.emailService.getVariableData$('testMany1');

  constructor(private personService: PersonService, private emailService: EmailService, private store: Store<any>) { }

  ngOnInit(): void {
    this.personService.getOne$(500153, {
      variableName: 'selectedCollaborator',
      onSuccess: (data) => {
        /*this.personService.loadRelation$(data, 'emails', {
          variableName: 'emails',
          onSuccess: (val) => {
            console.log(val)
            data.setRelation(val.getData())
          }
        })
        //this.personService.getOne$(500154);
        this.personService.getRelation$(data, 'emails')*/
        const query = this.personService.query();
        this.personService.loadMany$(query.getBuilder(), 0, {
          variableName: 'testMany'
        });
      }
    });
    this.personService.getOne$(500154, {
      variableName: 'selectedCollaborator1',
      onSuccess: (data) => {
        /*this.personService.loadRelation$(data, 'emails', {
          variableName: 'emails',
          onSuccess: (val) => {
            console.log(val)
            data.setRelation(val.getData())
          }
        })
        //this.personService.getOne$(500154);
        this.personService.getRelation$(data, 'emails')*/
        const query = this.personService.query();
        this.personService.loadMany$(query.getBuilder(), 0, {
          variableName: 'testMany1'
        });
      }
    });
  }

  sendUpdate() {
    this.personService.selectOne(500153).subscribe(
      (value) => {
        value.familyName = "GANNEVAL";
        this.personService.save$(value)
      }
    )
  }

  createPerson() {
    let d = new Person()
    d.familyName = "testt"
    d.clientId = 500000
    this.personService.save$(d)
  }

  getEmails() {
    this.personService.selectOne(500153).subscribe(
      (value: Person) => {
        this.personService.loadRelation(value, 'emails')
      }
    )
  }
}
