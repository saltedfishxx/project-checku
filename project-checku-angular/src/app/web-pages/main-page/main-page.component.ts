import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { ApiCallService } from '@apiService';
import { URLS } from '@urls';
import { Router } from '@angular/router';
import { FluidModalService } from '@fluidModalService';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(
    private api: ApiCallService,
    private router: Router,
    private fluidModalSvc: FluidModalService
  ) { }

  pendingSMSConfig: TableConfig = new TableConfig();
  holdingAccountConfig: TableConfig = new TableConfig();
  successPaymentConfig: TableConfig = new TableConfig();
  rejectedPaymentConfig: TableConfig = new TableConfig();

  pendingSms: any[];
  holdingAccount: any[];
  successPayment: any[];
  rejectedPayment: any[];
  userSession: any = {};
  processCount: any;

  tab: number = 1;
  ngOnInit() {
    this.getUserAppSession();
    this.initTables();
    this.getPendingSMS();
    this.getHoldingAccounts();
    this.getSuccessPayments();
    this.getRejetedPayments();
  }

  getUserAppSession() {
    //TODO: get user session from local storage
    this.userSession.staffName = "Clera Xiao Liew";
    this.processCount = parseInt(localStorage.getItem("processCount"));
  }

  initTables() {
    this.initPendingSMSTable();
    this.initHoldingAccountTable();
    this.initSuccessPaymentTable();
    this.initRejectedPaymentTable();
  }

  getPendingSMS() {
    let urls = URLS.GET_RECORDS + "/pending";
    if (URLS.stubData) {
      urls = "./assets/jsonData/getPendingSMS.json";
    }
    this.api.getRecords(urls).then((response: any) => {
      this.pendingSms = response.data;
      this.pendingSMSConfig.value = this.pendingSms;
    });
  }
  getHoldingAccounts() {
    let urls = URLS.GET_RECORDS + "/holding";
    if (URLS.stubData) {
      urls = "./assets/jsonData/getHoldingAccount.json";
    }
    this.api.getRecords(urls).then((response: any) => {
      this.holdingAccount = response.data;
      for (let row of this.holdingAccount) {
        if (row.paymentStatus == "holdingPending") {
          row.status = "pending";
        } else if (row.paymentStatus == "holdingUnverified") {
          row.status = "unverified";
        }
      }
      this.holdingAccountConfig.value = this.holdingAccount;
    });
  }
  getSuccessPayments() {
    let urls = URLS.GET_RECORDS + "/success";
    if (URLS.stubData) {
      urls = "./assets/jsonData/getSuccessPayments.json";
    }
    this.api.getRecords(urls).then((response: any) => {
      this.successPayment = response.data;
      this.successPaymentConfig.value = this.successPayment;
    });
  }
  getRejetedPayments() {
    let urls = URLS.GET_RECORDS + "/rejected";
    if (URLS.stubData) {
      urls = "./assets/jsonData/getRejectedPayments.json";
    }
    this.api.getRecords(urls).then((response: any) => {
      this.rejectedPayment = response.data;
      this.rejectedPaymentConfig.value = this.rejectedPayment;
    });
  }

  dropdownSelected(event) {
    console.log('dropdown', event);
    switch (event.id) {
      case 1:
        this.openChequeDetailsHolding(event);
    }
  }

  openChequeDetailsReject(event) {
    console.log('button', event);
    let addresseeCorrect = "";
    let signature = "";
    let cheque = event.rowData;

    for (let row in event.rowData) {
      if (event.rowData[row] == "") {
        event.rowData[row] = "Not Provided";
      }
    }

    if (event.rowData.addresseeCorrect == "false") {
      addresseeCorrect = "Correct";
    } else {
      addresseeCorrect = "Not Correct"
    }

    if (event.rowData.signatureExists == "false") {
      signature = "Not Provided";
    } else {
      signature = "Provided";
    }
    let template = {
      addresseeCorrect: addresseeCorrect,
      chequeDate: cheque.chequeDate,
      amount: "S$" + cheque.chequeAmount,
      signature: signature,
      chequeCustomer: cheque.chequeName,
      chequeContact: cheque.chequeContact,
      chequePolicyNo: cheque.chequePolicyNo,
      chequePremiumType: cheque.chequePremiumType
    }

    console.log(template);
    console.log("details for reject clicked");
    let data = {
      header: "Cheque details",
      imageFront: "../../assets/img/cheques/1. sample check dh.jpg",
      imageBack: "../../assets/img/cheques/sample check dh back.jpg",
      template: template
    }
    this.fluidModalSvc.openFluidModal(data);
  }

  openChequeDetailsHolding(event) {
    let addresseeCorrect = "";
    let signature = "";
    let cheque = event.rowData;

    for (let row in event.rowData) {
      if (event.rowData[row] == "") {
        event.rowData[row] = "Not Provided";
      }
    }

    if (event.rowData.addresseeCorrect == "false") {
      addresseeCorrect = "Correct";
    } else {
      addresseeCorrect = "Not Correct"
    }

    if (event.rowData.signatureExists == "false") {
      signature = "Not Provided";
    } else {
      signature = "Provided";
    }
    let template = {
      addresseeCorrect: addresseeCorrect,
      chequeDate: cheque.chequeDate,
      amount: "S$" + cheque.amount,
      signature: signature,
      chequeCustomer: cheque.chequeCustomer,
      chequeContact: cheque.chequeContact,
      chequePolicyNo: cheque.chequePolicyNo,
      chequePremiumType: cheque.chequePremiumType
    }

    console.log(template);
    console.log("details clicked");
    let data = {
      header: "Cheque details",
      imageFront: "../../assets/img/cheques/1. sample check dh.jpg",
      imageBack: "../../assets/img/cheques/sample check dh back.jpg",
      template: template
    }
    this.fluidModalSvc.openFluidModal(data);
  }

  initPendingSMSTable() {
    let cols = [
      {
        header: 'Account No.',
        field: 'accountNo',
        width: '10%'
      },
      {
        header: 'Cheque No',
        field: 'chequeNo',
        width: '10%'
      },
      {
        header: 'Bank No.',
        field: 'bankNo',
        width: '3%'
      },
      {
        header: 'Branch No.',
        field: 'branchNo',
        width: '3%'
      },
      {
        header: 'Amount',
        field: 'amount',
        width: '3%',
        currency: '.2-2'
      },
      {
        header: 'Possible Policy No.',
        field: 'possiblePolicyNo',
        width: '10%'
      },
      {
        header: 'Possible Customer',
        field: 'possibleCustomer',
        width: '10%'
      },
      {
        header: 'Contact',
        field: 'contact',
        width: '10%'
      },
      {
        header: 'Date SMS sent',
        field: 'dateSmsSent',
        width: '15%'
      },
      {
        header: 'Sms Cycle',
        field: 'smsCycle',
        width: '15%',
        hasBar: true
      },
      {
        header: 'Status',
        field: 'smsStatus',
        width: '20%',
        isStatus: true
      }
    ]
    this.pendingSMSConfig.columns = cols;
    this.pendingSMSConfig.showPagination = false;
    this.pendingSMSConfig.minWidth = '1200px';
  }
  initHoldingAccountTable() {
    let cols = [
      {
        header: 'Account No.',
        field: 'accountNo',
        width: '10%'
      },
      {
        header: 'Cheque No',
        field: 'chequeNo',
        width: '10%'
      },
      {
        header: 'Bank No.',
        field: 'bankNo',
        width: '5%'
      },
      {
        header: 'Branch No.',
        field: 'branchNo',
        width: '5%'
      },
      {
        header: 'Amount',
        field: 'amount',
        width: '10%',
        currency: '.2-2'
      },
      {
        header: 'Cheque Date',
        field: 'chequeDate',
        width: '10%'
      },
      {
        header: 'Cheque Name',
        field: 'chequeCustomer',
        width: '10%'
      },
      {
        header: 'Processed Date',
        field: 'processedDate',
        width: '15%'
      },
      {
        header: 'Reviewed By',
        field: 'reviewedBy',
        width: '15%'
      },
      {
        header: 'Status',
        field: 'status',
        width: '10%',
        isStatus: true
      }
    ];

    let dropdown: any = [
      {
        id: 1,
        name: 'Details',
        icon: 'info-circle',
        iconColor: 'info'
      },
      {
        id: 2,
        name: 'Move to Successful Payments',
        icon: 'exchange-alt',
        iconColor: 'success'
      }
    ]

    this.holdingAccountConfig.columns = cols;
    this.holdingAccountConfig.showPagination = false;
    this.holdingAccountConfig.minWidth = '1200px';
    this.holdingAccountConfig.dropdownList = dropdown;
    this.holdingAccountConfig.hasHamburger = true;

  }

  initSuccessPaymentTable() {

    let cols = [
      {
        header: 'Policy No.',
        field: 'policyNo',
        width: '10%'
      },
      {
        header: 'Policy Type',
        field: 'policyType',
        width: '10%'
      },
      {
        header: 'Premium Type',
        field: 'premiumType',
        width: '10%'
      },
      {
        header: 'Amount',
        field: 'amount',
        width: '5%',
        currency: '.2-2'
      },
      {
        header: 'NRIC',
        field: 'nric',
        width: '5%'
      },
      {
        header: 'Customer Name',
        field: 'customerName',
        width: '10%',
      },
      {
        header: 'Payment Date',
        field: 'paymentDate',
        width: '10%'
      },
      {
        header: 'Due Date',
        field: 'dueDate',
        width: '10%'
      },
      {
        header: 'Processed Date',
        field: 'processedDate',
        width: '10%'
      },
      {
        header: 'Reviewed By',
        field: 'reviewedBy',
        width: '15%'
      }
    ];

    this.successPaymentConfig.columns = cols;
    this.successPaymentConfig.showPagination = false;
    this.successPaymentConfig.minWidth = '1200px';

  }
  initRejectedPaymentTable() {
    let cols = [
      {
        header: 'Account No.',
        field: 'accountNo',
        width: '10%'
      },
      {
        header: 'Cheque No',
        field: 'chequeNo',
        width: '10%'
      },
      {
        header: 'Bank No.',
        field: 'bankNo',
        width: '5%'
      },
      {
        header: 'Branch No.',
        field: 'branchNo',
        width: '5%'
      },
      {
        header: 'Amount',
        field: 'chequeAmount',
        width: '5%',
        currency: '.2-2'
      },
      {
        header: 'Policy No.',
        field: 'chequePolicyNo',
        width: '10%'
      },
      {
        header: 'Processed Date',
        field: 'processedDate',
        width: '10%'
      },
      {
        header: 'Reviewed By',
        field: 'reviewedBy',
        width: '10%'
      },
      {
        header: 'Reason of Rejection',
        field: 'rejectReason',
        width: '20%'
      }
    ];

    this.rejectedPaymentConfig.columns = cols;
    this.rejectedPaymentConfig.showPagination = false;
    this.rejectedPaymentConfig.minWidth = '1200px';
    this.rejectedPaymentConfig.hasButton = true;
  }

  changeTab(selectNum) {
    this.tab = selectNum;
  }

  navigate(destination) {
    switch (destination) {
      case 'upload':
        this.router.navigate(['upload']);
        break;
      case 'review':
        this.router.navigate(['process-cheques']);
        break;
      case 'logout':
        this.router.navigate(['login']);
        break;
    }

  }
}
