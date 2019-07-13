import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { ApiCallService } from '@apiService';
import { ProcessChequesService } from '../process-cheques.service';
import { ConfirmDialogService } from '@confirmDialogSerivce';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'review-cheques',
  templateUrl: './review-cheques.component.html',
  styleUrls: []
})
export class ReviewChequesComponent implements OnInit {

  constructor(private processChequeSvc: ProcessChequesService,
    private confirmDialogSvc: ConfirmDialogService,
    private toastSvc: ToastrService) { }

  chequeDetailsForm: FormGroup;
  reviewCheques: any[] = [];
  currentChequeReviewed: any;
  currentPage: any;
  formDisabled: boolean = false;
  isEditing: boolean = false;
  toggleChequeImg: boolean = false;
  disableButtons: any[] = [];
  smsSent: boolean = false;

  reviewTableConfig: TableConfig = new TableConfig();


  ngOnInit() {
    this.initChequeForm();
    this.initReviewTable();
    this.getProcessedCheques();
  }

  getProcessedCheques() {
    this.processChequeSvc.getProcessedCheques('review').then((cheques: any) => {
      this.reviewCheques = cheques;

      this.loadReviewPage(1);
    });
  }

  initChequeForm() {
    this.chequeDetailsForm = new FormGroup({
      policyNo: new FormControl('', []),
      policyType: new FormControl('', []),
      custName: new FormControl('', []),
      contact: new FormControl('', []),
      amount: new FormControl('', []),
      date: new FormControl('', [])
    });
  }

  populateChequeForm(data) {
    this.chequeDetailsForm.patchValue({
      policyNo: data.policyNo ? data.policyNo : 'NOT PROVIDED',
      policyType: data.policyType ? data.policyType : 'NOT PROVIDED',
      custName: data.customerName ? data.customerName : 'NOT PROVIDED',
      contact: data.contact ? data.contact : 'NOT PROVIDED',
      amount: data.amount ? data.amount : 'NOT PROVIDED',
      date: data.date ? data.date : 'NOT PROVIDED'
    });
  }

  initReviewTable() {
    let cols: any[] = [
      {
        header: 'Match',
        field: 'overallMatch',
        width: '10%',
        isPercent: true
      },
      {
        header: 'NRIC',
        field: 'predictedNric',
        width: '20%'
      },
      {
        header: 'Name',
        field: 'predictedName',
        width: '20%'
      },
      {
        header: 'Policy No.',
        field: 'predictedPolicyNo',
        width: '20%',
      },
      {
        header: 'Premium Type',
        field: 'predictedPremiumType',
        width: '20%'
      },
      {
        header: 'Policy Type',
        field: 'predictedPolicyType',
        width: '10%'
      },
      {
        header: 'Payment Due',
        field: 'predictedPaymentDue',
        width: '20%'
      },
      {
        header: 'Sig. Match',
        field: 'signatureMatch',
        width: '15%',
        isPercent: true
      }
    ];

    this.reviewTableConfig.columns = cols;
    this.reviewTableConfig.hasButton = true;
    this.reviewTableConfig.showPagination = false;
    this.reviewTableConfig.disableButtonsList = [];
  }

  loadReviewPage(pageToLoad) {
    this.currentPage = pageToLoad;
    this.currentChequeReviewed = this.reviewCheques[pageToLoad - 1];
    this.populateChequeForm(this.currentChequeReviewed.chequeDetail);
    this.chequeDetailsForm.disable();
    this.formDisabled = true;
    this.reviewTableConfig.value = this.currentChequeReviewed.prediction;
    this.reviewTableConfig.refresh();
  }




  /**
   * CLICK EVENTS
   */

  onEdit() {
    this.chequeDetailsForm.enable();
    this.formDisabled = false;
    this.isEditing = true;
  }

  onEditDone() {
    this.chequeDetailsForm.disable();
    this.formDisabled = true;
    this.isEditing = false;

    //TODO: verify form input if its not null, else submit to server to process cheque again
  }

  onNextPage() {
    if (this.currentPage < this.reviewCheques.length) {
      console.log("Next Cheque");
      this.loadReviewPage(this.currentPage + 1);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      console.log("Previous Cheque");
      this.loadReviewPage(this.currentPage - 1);
    }
  }

  onClickSend(event) {
    console.log(event);
    let price = this.currentChequeReviewed.chequeDetail.amount;

    let message = "The customer will receive the following message: \nDear " + event.rowData.predictedName + ",\nPlease verfiy that " +
      "you have made a payment of S$" + price + " to Prudential. To verify, " +
      "please reply with your POLICY NUMBER.\nPlease ignore this message if you are not the intended recipient."
    let data = {
      header: "Send Verification SMS",
      description: message,
      positive: "Send",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(send => {
      //if confirm send
      if (send) {
        this.disableButtons.push('Send SMS' + event.i);
        this.reviewTableConfig.disableButtonsList = this.disableButtons;
        this.reviewTableConfig.value = this.currentChequeReviewed.prediction;
        this.reviewTableConfig.refresh();
        this.smsSent = true;
        //TODO: send sms + add record of person sent to server
        this.toastSvc.success("SMS has been successfully sent!", "", { positionClass: 'toast-bottom-left' });
      }
    });
  }


  onFinishReview() {
    let data = {
      header: "Confirm Finish View",
      description: "Finish reviewing this cheque?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(yes => {
      //if confirm send
      if (yes) {
        this.reviewCheques.splice(this.reviewCheques.indexOf(this.currentChequeReviewed), 1);
        this.loadReviewPage(1);
        this.processChequeSvc.updateReviewCheques(this.reviewCheques);
        //TODO: add record of cheque sent to server
        this.toastSvc.success("Review for this cheque has been completed!", "", { positionClass: 'toast-bottom-left' });
      }
    });
  }

  onAccept() {

  }

  onReject() {

  }
}
