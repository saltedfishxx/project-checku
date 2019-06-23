import { Injectable } from '@angular/core';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private modalService: MDBModalService) { }

  modalRef: MDBModalRef;
  config: any;

  openDialog(data) {

    this.config = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: 'modal-dialog-centered',
      containerClass: '',
      animated: true,
      data: {
        heading: 'Modal heading',
        content: {
          heading: data.header,
          description: data.description,
          positiveLabel: data.positive,
          negativeLabel: data.negative
        }
      }
    }
    this.modalRef = this.modalService.show(ConfirmDialogComponent, this.config);

    this.modalRef.content.action.subscribe((result: any) => { console.log(result); });
  }
}
