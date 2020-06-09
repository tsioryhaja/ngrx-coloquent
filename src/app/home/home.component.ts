import { Component, OnInit } from '@angular/core';
import { PersonService } from '../ngrx/person.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  collaborator: Observable<any> = this.personService.selectOne(500153)

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.personService.getOne$(500153)
  }

  sendUpdate() {
    this.personService.selectOne(500153).subscribe(
      (value) => {
        value.familyName = "TOTO";
        this.personService.save$(value)
      }
    )
  }

}
