import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html'
})
export class TestPageComponent implements OnInit {

  testConfig: TableConfig = new TableConfig();
  modalRef: MDBModalRef;

  constructor(private modalService: MDBModalService) { }

  ngOnInit() {
    let cols: any = [
      {
        header: 'header 4',
        field: 'SignatureMatch',
        width: '30%',
        isPercent: true
      },
      {
        header: 'header 1',
        field: 'NRIC',
        width: '10%'
      },
      {
        header: 'header 2',
        field: 'Name',
        width: '30%'
      }
    ]

    let nestedCols = [
      {
        header: 'match',
        field: 'Match',
        width: '10%',
        isPercent: true
      },
      {
        header: 'policyno',
        field: 'PolicyNo',
        width: '10%'
      },
      {
        header: 'premium',
        field: 'PremiumType',
        width: '10%'
      }
    ]

    this.testConfig.hoverable = true;
    this.testConfig.hasBorders = true;
    this.testConfig.columns = cols;
    // this.testConfig.nestedColumns = nestedCols;
    // this.testConfig.value = [{
    //   "NRIC": "S123456E",
    //   "Name": "Checken nugget",
    //   "SignatureMatch": "0.99",
    //   "Policies": [
    //     { "Match": "0.98", "PolicyNo": "12736821736", "PremiumType": "Premium" },
    //     { "Match": "0.68", "PolicyNo": "12736213121736", "PremiumType": "Premium" }
    //   ]
    // },
    // {
    //   "NRIC": "S0987665V",
    //   "Name": "Ducky",
    //   "SignatureMatch": "0.99",
    //   "Policies": [
    //     { "Match": "0.98", "PolicyNo": "12736821736", "PremiumType": "Premium" },
    //     { "Match": "0.68", "PolicyNo": "12736213121736", "PremiumType": "Premium" }
    //   ]
    // }]

    this.testConfig.value = [{
      "NRIC": "xxxxxx",
      "Name": "xxxxxx",
      "SignatureMatch": "0.99",
    },
    {
      "NRIC": "xxxxxx",
      "Name": "xxxxxx",
      "SignatureMatch": "0.99"
    }]
  }

  onClick(event){
    console.log(event);
  }

  // onClick(event) {
  //   let rowData = event.rowData;
  //   let customer = event.customer;
  //   console.log(rowData);

  //   let message = customer.Name +" will receive the following message: \n\n Dear Customer, Please verify that you had made a payment of S$800 to Prudential. To verify, please reply with your POLICY NUMBER. Please ignore this message if you are not the intended recipient."


  //   let modalOptions = {
  //     backdrop: true,
  //     keyboard: true,
  //     focus: true,
  //     show: false,
  //     ignoreBackdropClick: false,
  //     class: 'modal-dialog-centered',
  //     containerClass: '',
  //     animated: true,
  //     data: {
  //       heading: 'Modal heading',
  //       content: {
  //         heading: 'Send Verification Sms',
  //         description: message,
  //         positiveLabel: 'Send',
  //         negativeLabel: 'Cancel'
  //       }
  //     }
  //   }

  //   this.modalRef = this.modalService.show(ConfirmDialogComponent, modalOptions);

  //   this.modalRef.content.action.subscribe((result: any) => { console.log(result); });
  // }
}


/*column/nestedColumns:
  isStatus
  hasBar
  currency
  dateFormat
  header
  field
  width
  style
  isPercent

config:
hoverable
columns
value
hasCheckBox
hasHamburger
isStripe
hasBorders
stickyHeader

*/