import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { ProcessChequesService } from '../process-cheques.service';
import { ConfirmDialogService } from '@confirmDialogSerivce';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'reject-cheques',
  templateUrl: './reject-cheques.component.html',
  styleUrls: []
})
export class RejectChequesComponent implements OnInit {

  constructor(private processChequeSvc: ProcessChequesService,
    private confirmDialogSvc: ConfirmDialogService,
    private toastSvc: ToastrService) { }

  rejectCheques: any[] = [];
  disableButtons: any[] = [];
  selectedRows: any[] = [];

  rejectTableConfig: TableConfig = new TableConfig();

  ngOnInit() {
    this.initTable();
    this.getProcessedRejectCheques();
  }

  getProcessedRejectCheques() {
    this.processChequeSvc.getLatestCheque('reject').subscribe((cheques: any[]) => {
      this.rejectCheques = cheques;
      this.rejectTableConfig.value = this.rejectCheques;
    });
  }

  initTable() {
    let cols: any[] = [
      {
        header: 'Cheque',
        field: 'imageFront',
        width: '20%',
        image: true
      },
      {
        header: '',
        field: 'imageBack',
        width: '20%',
        image: true
      },
      {
        header: 'Reason of rejection',
        field: 'rejectReason',
        width: '20%'
      }

    ];

    this.rejectTableConfig.columns = cols;
    this.rejectTableConfig.hasButton = true;
    this.rejectTableConfig.hasCheckBox = true;
    this.rejectTableConfig.showPagination = false;
    this.rejectTableConfig.disableButtonsList = [];

  }

  /**
   * CLICK EVENTS
   */

  //checkbox event
  onRowSelect(event) {
    this.selectedRows = event;
  }

  //Button event when user wants to review cheque
  onReject() {
    let data = {
      header: "Confirm Reject",
      description: "Confirm rejecting the selected cheques?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(yes => {
      //if confirm send
      if (yes) {
        this.addChequeRecord('reject');
        this.toastSvc.success("Successfully rejected the cheques!", "");
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

  addChequeRecord(type) {
    //TODO: add record of cheque sent to server
    switch (type) {
      case 'review':
        break;
      case 'reject':
        break;
      case 'success':
        break;
    }

    //remove selected cheques from view
    if (this.rejectCheques.length > 1) {
      this.selectedRows.forEach(row => {
        let i = this.rejectCheques.indexOf(row.rowData);
        if (i != -1) {
          this.rejectCheques.splice(i, 1);
        }
      });
      this.processChequeSvc.updateRejectCheques(this.rejectCheques);
    } else {
      this.processChequeSvc.updateRejectCheques([]);
    }

    //clear selected rows
    this.selectedRows = [];
    this.rejectTableConfig.refresh();

  }
}
