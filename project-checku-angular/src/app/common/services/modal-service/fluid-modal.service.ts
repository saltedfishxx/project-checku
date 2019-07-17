import { Injectable } from '@angular/core';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { FluidModalComponent } from '../../components/fluid-modal/fluid-modal.component';

@Injectable({
  providedIn: 'root'
})
export class FluidModalService {

  constructor(private modalService: MDBModalService) { }

  modalRef: MDBModalRef;
  config: any;

  openFluidModal(data) {

    this.config = {
      backdrop: false,
      keyboard: true,
      show: false,
      ignoreBackdropClick: false,
      class: 'modal-full-height modal-bottom modal-notify modal-primary',
      containerClass: 'top animated slideInUp faster',
      animated: true,
      data: {
        heading: data,
        content: {
          heading: data.header,
          description: data.description,
          positiveLabel: data.positive,
          negativeLabel: data.negative,
          imageFront: data.imageFront,
          imageBack: data.imageBack
        }
      }
    }
    this.modalRef = this.modalService.show(FluidModalComponent, this.config);

    this.modalRef.content.action.subscribe((result: any) => { console.log(result); });
  }
}
