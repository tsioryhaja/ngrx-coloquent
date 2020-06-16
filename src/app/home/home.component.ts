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
  collaborator: Observable<any> = this.personService.getVariableData$('selectedCollaborator')
  emails: Observable<any> = this.emailService.getVariableData$('emails')
  errors: Observable<any> = this.personService.getVariable$('errors')

  constructor(private personService: PersonService, private emailService: EmailService, private store: Store<any>) { }

  ngOnInit(): void {
    this.personService.getOne$(500153, {
      variableName: 'selectedCollaborator',
      onSuccess: (data) => {
        this.personService.loadRelation$(data, 'emails', {
          variableName: 'emails',
          onSuccess: (val) => {
            console.log(val)
            data.setRelation(val.getData())
          }
        })
      }
    })
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
