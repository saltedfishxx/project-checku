import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadChequesComponent } from './upload-cheques.component';

describe('UploadChequesComponent', () => {
  let component: UploadChequesComponent;
  let fixture: ComponentFixture<UploadChequesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadChequesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadChequesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
