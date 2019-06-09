import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableCheckboxButtonComponent } from './datatable-checkbox-button.component';

describe('DatatableCheckboxButtonComponent', () => {
  let component: DatatableCheckboxButtonComponent;
  let fixture: ComponentFixture<DatatableCheckboxButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatableCheckboxButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableCheckboxButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
