import { Component, OnInit } from '@angular/core';
import { ProcessChequesService } from '../process-cheques.service';
import { ConfirmDialogService } from '@confirmDialogSerivce';
import { ToastrService } from 'ngx-toastr';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { FluidModalService } from '@fluidModalService';

@Component({
  selector: 'success-cheques',
  templateUrl: './success-cheques.component.html',
  styleUrls: []
})
export class SuccessChequesComponent implements OnInit {


  constructor(private processChequeSvc: ProcessChequesService,
    private confirmDialogSvc: ConfirmDialogService,
    private toastSvc: ToastrService,
    private fluidModalSvc: FluidModalService) { }

  successCheques: any[] = [];
  disableButtons: any[] = [];
  selectedRows: any[] = [];

  successTableConfig: TableConfig = new TableConfig();

  ngOnInit() {
    this.initTable();
    this.getProcessedsuccessCheques();
  }

  getProcessedsuccessCheques() {
    this.processChequeSvc.getLatestCheque('success').subscribe((cheques: any[]) => {
      this.successCheques = cheques;
      this.successTableConfig.value = this.successCheques;
    });
  }

  initTable() {
    let cols: any[] = [
      {
        header: 'Policy',
        field: 'policyNo',
        width: '20%'
      },
      {
        header: 'Premium Type',
        field: 'premiumType',
        width: '10%'
      },
      {
        header: 'Amount',
        field: 'amount',
        width: '10%',
        currency: '1.2-2'
      },
      {
        header: 'Name',
        field: 'customerName',
        width: '20%'
      },
      {
        header: 'Contact',
        field: 'contact',
        width: '10%'
      },
      {
        header: 'Date',
        field: 'date',
        width: '20%',
        dateFormat: 'dd/MM/yyyy'
      }

    ];

    this.successTableConfig.columns = cols;
    this.successTableConfig.hasButton = true;
    this.successTableConfig.hasCheckBox = true;
    this.successTableConfig.showPagination = false;
    this.successTableConfig.disableButtonsList = [];

  }

  /**
   * CLICK EVENTS
   */

  //checkbox event
  onRowSelect(event) {
    this.selectedRows = event;
  }

  //Button event when user wants to review cheque
  onAccept() {
    let data = {
      header: "Confirm Accept",
      description: "Confirm accept the selected cheques?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(yes => {
      //if confirm send
      if (yes) {
        this.addChequeRecord('success');
        this.toastSvc.success("Successfully accepted the cheques!", "");
      }
    });
  }

  onReview() {
    let data = {
      header: "Confirm Move to Review",
      description: "Confirm moving the selected cheques to review?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(yes => {
      //if confirm send
      if (yes) {
        this.addChequeRecord('review');
        this.toastSvc.success("Successfully moved the cheques to review!", "");
      }
    });
  }

  onViewCheque(event) {
    console.log(event);

    let selectedCheque: any = event.rowData;
    console.log("details clicked");
    let data = {
      header: "Cheque details",
      imageFront: selectedCheque.imageFront,
      imageBack: selectedCheque.imageBack,
      description: "this is a joke how to pass image gonna fail this hackathon YEET"
    }
    this.fluidModalSvc.openFluidModal(data);
  }

  addChequeRecord(type) {
    //TODO: add record of cheque sent to server
    switch (type) {
      case 'review':
        break;
      case 'success':
        break;
      case 'success':
        break;
    }

    //remove selected cheques from view
    if (this.successCheques.length > 1) {
      this.selectedRows.forEach(row => {
        let i = this.successCheques.indexOf(row.rowData);
        if (i != -1) {
          this.successCheques.splice(i, 1);
        }
      });
      this.processChequeSvc.updateSuccessCheques(this.successCheques);
    } else {
      this.processChequeSvc.updateSuccessCheques([]);
    }

    //clear selected rows
    this.selectedRows = [];
    this.successTableConfig.refresh();

  }

}
