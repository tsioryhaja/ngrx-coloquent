import { TestBed } from '@angular/core/testing';

import { NgrxColoquentService } from './ngrx-coloquent.service';

describe('NgrxColoquentService', () => {
  let service: NgrxColoquentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgrxColoquentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
