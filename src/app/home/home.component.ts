import { Component, OnInit } from '@angular/core';
import { GlobalEntityService } from 'projects/ngrx-coloquent/src/public-api';
import { Identity } from '../models/collaborator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  constructor(private service: GlobalEntityService) {}

  ngOnInit(): void {
    this.service.loadOne$(Identity, '500245');
  }

  
}
