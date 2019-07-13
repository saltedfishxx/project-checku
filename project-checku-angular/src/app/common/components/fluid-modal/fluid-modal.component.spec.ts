import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidModalComponent } from './fluid-modal.component';

describe('FluidModalComponent', () => {
  let component: FluidModalComponent;
  let fixture: ComponentFixture<FluidModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
