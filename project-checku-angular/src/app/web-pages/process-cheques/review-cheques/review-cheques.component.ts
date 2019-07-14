import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
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
  reviewCheques: any = [];
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
    this.getProcessedReviewCheques();
  }

  getProcessedReviewCheques() {
    this.processChequeSvc.getLatestCheque('review').subscribe((cheques: any[]) => {
      this.reviewCheques = cheques;
      //add id to each cheque
      this.addIndex("index", this.reviewCheques);
      //load page with first cheque in view
      if (this.reviewCheques.length > 0) {
        this.loadReviewPage(1);
      } else {
        this.loadReviewPage(0);
      }

    });
  }

  initChequeForm() {
    this.chequeDetailsForm = new FormGroup({
      policyNo: new FormControl('', []),
      premiumType: new FormControl('', []),
      custName: new FormControl('', []),
      contact: new FormControl('', []),
      amount: new FormControl('', []),
      date: new FormControl('', [])
    });
  }

  populateChequeForm(data) {
    this.chequeDetailsForm.patchValue({
      policyNo: data.policyNo ? data.policyNo : 'NOT PROVIDED',
      premiumType: data.premiumType ? data.premiumType : 'NOT PROVIDED',
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
        field: 'score',
        width: '10%',
        isPercent: true
      },
      {
        header: 'NRIC',
        field: 'nric',
        width: '20%'
      },
      {
        header: 'Name',
        field: 'name',
        width: '20%'
      },
      {
        header: 'Contact',
        field: 'contact',
        width: '10%'
      },
      {
        header: 'Policy No.',
        field: 'policyno',
        width: '20%',
      },
      {
        header: 'Policy Type',
        field: 'policytype',
        width: '10%'
      },
      {
        header: 'Payment Due',
        field: 'duedate',
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
    //if no more cheques for review
    if (this.currentPage == 0) {
      this.initChequeForm();
      this.chequeDetailsForm.disable();
      this.formDisabled = true;
      this.initReviewTable();
      this.reviewTableConfig.value = [];
      this.reviewTableConfig.refresh();
    } else {
      this.currentChequeReviewed = this.reviewCheques[pageToLoad - 1];
      this.reviewTableConfig.currentPage = this.currentChequeReviewed.index;
      this.populateChequeForm(this.currentChequeReviewed.chequeDetail);
      this.chequeDetailsForm.disable();
      this.formDisabled = true;

      let prediction: any = this.currentChequeReviewed.prediction;
      if (this.currentChequeReviewed.chequeDetail.hasSignature) {
        for (var i = 0; i < prediction.length; i++) {
          prediction[i].signatureMatch = "0.99"; // Add "total": 2 to all objects in array
        }
      }

      this.reviewTableConfig.value = prediction;
      this.reviewTableConfig.refresh();
    }

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

  //Navigation for paginator events
  onNextPage() {
    if (this.currentPage < this.reviewCheques.length) {
      console.log("Next Cheque");
      this.reviewTableConfig.refresh();
      this.loadReviewPage(this.currentPage + 1);

    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      console.log("Previous Cheque");
      this.reviewTableConfig.refresh();
      this.loadReviewPage(this.currentPage - 1);
    }
  }

  //Button event when user clicks send SMS button
  onClickSend(event) {
    console.log(event);
    let price = this.currentChequeReviewed.chequeDetail.amount;

    let message = "The customer will receive the following message: \nDear " + event.rowData.name + ",\nPlease verfiy that " +
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
        this.reviewTableConfig.currentPage = this.currentChequeReviewed.index;
        this.disableButtons.push('Send SMS' + event.i + this.currentChequeReviewed.index);
        this.reviewTableConfig.disableButtonsList = this.disableButtons;
        this.reviewTableConfig.value = this.currentChequeReviewed.prediction;
        this.reviewTableConfig.refresh();
        this.smsSent = true;
        //TODO: send sms + add record of person sent to server
        this.toastSvc.success("SMS has been successfully sent!", "");
      }
    });
  }

  //Button event when user finishes reviewing the current cheque
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
        this.addChequeRecord('review');
        this.toastSvc.success("Review for this cheque has been completed!", "");
        this.smsSent = false;
      }
    });
  }

  //Button event when user wants to accept current cheque
  onAccept() {
    let data = {
      header: "Confirm Accept",
      description: "Confirm moving this cheque as successful payment?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(yes => {
      //if confirm send
      if (yes) {
        this.addChequeRecord('success');
        this.toastSvc.success("Cheque has been moved to successful payments!", "");
      }
    });
  }

  //Button event when user wants to reject current cheque
  onReject() {
    let data = {
      header: "Confirm Reject",
      description: "Confirm moving this cheque as rejected payments?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogSvc.openDialog(data).then(yes => {
      //if confirm send
      if (yes) {
        this.addChequeRecord('reject');
        this.toastSvc.success("Cheque has been moved to rejected payments!", "");
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

    //remove selected cheque from view
    if (this.reviewCheques.length > 1) {
      this.reviewCheques.splice(this.reviewCheques.indexOf(this.currentChequeReviewed), 1);
      this.loadReviewPage(1);
      this.processChequeSvc.updateReviewCheques(this.reviewCheques);
    } else {
      this.loadReviewPage(0);
      this.processChequeSvc.updateReviewCheques([]);
    }
  }

  addIndex(indexFieldName: string, value) {
    value.forEach((element, index) => {
      element[indexFieldName] = index + 1;
    });
  }
}
