import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MDBModalRef } from 'angular-bootstrap-md';

@Component({
  selector: 'app-fluid-modal',
  templateUrl: './fluid-modal.component.html',
  styleUrls: ['./fluid-modal.component.scss']
})
export class FluidModalComponent implements OnInit {

  constructor(public modalRef: MDBModalRef) { }

  action: Subject<any> = new Subject();
  heading: string;
  content: any;

  ngOnInit() {
  }
  
  onPositiveClick() {
    this.action.next(true);
}
}
