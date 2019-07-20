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
  smsSent: boolean = false;
  selectedRows: any[] = [];

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
    let policyNo: string = data.policyNo;
    let isNull = policyNo.match(/^ *$/) === null;
    this.chequeDetailsForm.patchValue({
      policyNo: data.policyNo != 'None' && isNull ? data.policyNo : 'NOT PROVIDED',
      premiumType: data.premiumType != 'None' ? data.premiumType : 'NOT PROVIDED',
      custName: data.customerName != 'None' ? data.customerName : 'NOT PROVIDED',
      contact: data.contact != 'None' ? data.contact : 'NOT PROVIDED',
      amount: data.amount != 'None' ? data.amount : 'NOT PROVIDED',
      date: data.date != 'None' ? data.date : 'NOT PROVIDED'
    });
  }

  initReviewTable() {
    let cols: any[] = [
      {
        header: 'Overall Match',
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
    this.reviewTableConfig.hasCheckBox = true;
    this.reviewTableConfig.showPagination = false;
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
      if (this.currentChequeReviewed.chequeDetail.signatureExists) {
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

  //checkbox event 
  onRowSelect(event) {
    this.selectedRows = event;
    console.log(this.selectedRows);
  }

  //Button event when user finishes reviewing the current cheque
  onFinishReview() {
    let message = "";
    let data = {};
    if (this.selectedRows.length > 0) {
      message = "Selected customers will receive the following message: \nDear Customer,\nPlease verfiy that " +
        "you have made a payment of S$xxx to Prudential. To verify, " +
        "please reply with your POLICY NUMBER.\nPlease ignore this message if you are not the intended recipient."
      data = {
        header: "Send Verification SMS and Complete Review",
        description: message,
        positive: "Send and Finish Review",
        negative: "Cancel"
      }
    } else {
      message = "Confirm complete review without sending any SMS to possible customers!= 'None' ?"
      data = {
        header: "Complete Review",
        description: message,
        positive: "Finish Review",
        negative: "Cancel"
      }
    }

    this.confirmDialogSvc.openDialog(data).then(cfm => {
      //if confirm send
      if (cfm) {
        this.reviewTableConfig.currentPage = this.currentChequeReviewed.index;
        if (this.selectedRows.length > 0) {
          this.smsSent = true;
          this.toastSvc.success("SMS has been successfully sent!", "");
          this.toastSvc.success("Cheque has been successfully reviewed!", "");
          this.removeCheque();
          // this.sendSms().then(status => {
          //   if (status) {
          //     this.reviewTableConfig.refresh();
          //     this.toastSvc.success("SMS has been successfully sent!", "");
          //     this.addChequeRecord('review').then(added => {
          //       if (added) {
          //         this.toastSvc.success("Cheque has been successfully reviewed!", "");
          //       } else {
          //         this.toastSvc.error("Error completing review for cheque. Please try again.", "");
          //       }
          //     });
          //   }
          // }).catch(error => {
          //   console.log('Error in sending SMS', error);
          //   this.toastSvc.error("SMS could not be sent. Please try again.");
          // });
        } else {
          this.toastSvc.success("Cheque has been successfully reviewed!", "");
          this.removeCheque();
          // this.addChequeRecord('review').then(added => {
          //   if (added) {
          //     this.toastSvc.success("Cheque has been successfully reviewed!", "");
          //   } else {
          //     this.toastSvc.error("Error completing review for cheque. Please try again.", "");
          //   }
          // });
        }

      }
    });
  }

  //Button event when user wants to accept current cheque
  onAccept() {
    let data = {
      header: "Confirm Accept",
      description: "Confirm moving this cheque as successful payment!= 'None' ?",
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
      description: "Confirm moving this cheque as rejected payments!= 'None' ?",
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

  sendSms() {
    //TODO: send sms from selected Rows + add record of person sent to server
    return new Promise((resolve, reject) => {
      this.processChequeSvc.sendSms(this.selectedRows).then(res => {
        if (res) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  addChequeRecord(type) {
    //TODO: add record of cheque sent to server
    return new Promise((resolve, reject) => {
      switch (type) {
        case 'review':
          this.processChequeSvc.addReviewCheques({ data: this.currentChequeReviewed }).then(response => {
            if (response) {
              this.removeCheque();
              resolve(true);
            } else {
              resolve(false);
            }
          }).catch(error => {
            console.log('error submitting cheque', error);
            this.toastSvc.error("Technical Error. Please contact system administrator", "");
            reject(false);

          });
          break;
        case 'reject':
          break;
        case 'success':
          break;
      }
    });
  }

  removeCheque() {
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
