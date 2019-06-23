import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { constructor } from 'q';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  action: Subject<any> = new Subject();
  heading: string;
  content: any;

  constructor(public modalRef: MDBModalRef) { }

    onPositiveClick() {
      this.action.next(true);
  }
}


