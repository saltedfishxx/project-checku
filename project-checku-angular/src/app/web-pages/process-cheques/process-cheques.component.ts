import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiCallService } from '@apiService';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';

@Component({
  selector: 'app-process-cheques',
  templateUrl: './process-cheques.component.html',
  styleUrls: ['./process-cheques.component.scss']
})
export class ProcessChequesComponent implements OnInit {

  constructor(private api: ApiCallService) { }

  cardList: any[] = [
    { icon: "reject", title: "To Reject", count: 5 },
    { icon: "review", title: "To Review", count: 5 },
    { icon: "success", title: "To Accept", count: 5 }];

  chequeDetailsForm: FormGroup;
  currentPage: any;
  processedCheques: any[] = [];
  reviewCheques: any[] = [];
  rejectCheques: any[] = [];
  successCheques: any[] = [];

  reviewTableConfig: TableConfig = new TableConfig();


  checkIcon(card) {
    switch (card.icon) {
      case 'reject':
        return 'times-circle';
      case 'success':
        return 'check-circle';
      case 'review':
        return 'ellipsis-h';
    }
  }
  ngOnInit() {
    this.initChequeForm();
    this.initReviewTable();
    this.getProcessedCheques();
  }

  getProcessedCheques() {
    this.api.getRecords('./assets/jsonData/processed_cheques.json').then((res: any) => {
      this.processedCheques = res.data;
      console.log(this.processedCheques);
      this.rejectCheques = this.processedCheques['rejectedCheques'];
      this.reviewCheques = this.processedCheques['reviewCheques'];
      this.successCheques = this.processedCheques['successfulCheques'];


      this.loadReviewPage();
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

  initReviewTable() {
    let cols: any[] = [
      {
        header: 'Match',
        field: 'overallMatch',
        width: '75px',
        isPercent: true
      },
      {
        header: 'NRIC',
        field: 'predictedNric',
        width: '100px'
      },
      {
        header: 'Name',
        field: 'predictedName',
        width: '150px'
      },
      {
        header: 'Policy No.',
        field: 'predictedPolicyNo',
        width: '150px',
      },
      {
        header: 'Premium Type',
        field: 'predictedPremiumType',
        width: '100px'
      },
      {
        header: 'Policy Type',
        field: 'predictedPolicyType',
        width: '100px'
      },
      {
        header: 'Payment Due',
        field: 'predictedPaymentDue',
        width: '100px'
      },
      {
        header: 'Sig. Match',
        field: 'signatureMatch',
        width: '100px',
        isPercent: true
      }
    ];

    this.reviewTableConfig.columns = cols;
    this.reviewTableConfig.hasButton = true;
    this.reviewTableConfig.showPagination = false;
  }

  loadReviewPage() {
    this.currentPage = 1;
    this.reviewTableConfig.value = this.reviewCheques[this.currentPage - 1].prediction;
    this.reviewTableConfig.refresh();
    console.log(this.reviewTableConfig.value)
  }
}
