import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxColoquentComponent } from './ngrx-coloquent.component';

describe('NgrxColoquentComponent', () => {
  let component: NgrxColoquentComponent;
  let fixture: ComponentFixture<NgrxColoquentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgrxColoquentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxColoquentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
