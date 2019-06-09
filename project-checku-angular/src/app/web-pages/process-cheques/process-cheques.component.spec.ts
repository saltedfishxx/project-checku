import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessChequesComponent } from './process-cheques.component';

describe('ProcessChequesComponent', () => {
  let component: ProcessChequesComponent;
  let fixture: ComponentFixture<ProcessChequesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessChequesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessChequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
