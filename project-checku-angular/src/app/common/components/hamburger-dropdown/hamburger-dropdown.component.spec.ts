import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerDropdownComponent } from './hamburger-dropdown.component';

describe('HamburgerDropdownComponent', () => {
  let component: HamburgerDropdownComponent;
  let fixture: ComponentFixture<HamburgerDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamburgerDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamburgerDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
