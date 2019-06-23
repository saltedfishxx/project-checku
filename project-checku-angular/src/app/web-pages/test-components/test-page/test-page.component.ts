import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { FluidModalService } from 'src/app/common/components/fluid-modal/fluid-modal.service';
import { ConfirmDialogService } from 'src/app/common/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html'
})
export class TestPageComponent implements OnInit {

  testConfig: TableConfig = new TableConfig();

  testData1: any = [{
    "NRIC": "S123456E",
    "Name": "Checken nugget",
    "SignatureMatch": "0.99",
    "Policies": [
      { "Match": "0.98", "PolicyNo": "12736821736", "PremiumType": "Premium" },
      { "Match": "0.68", "PolicyNo": "12736213121736", "PremiumType": "Premium" }
    ]
  },
  {
    "NRIC": "S0987665V",
    "Name": "Ducky",
    "SignatureMatch": "0.99",
    "Policies": [
      { "Match": "0.98", "PolicyNo": "12736821736", "PremiumType": "Premium" },
      { "Match": "0.68", "PolicyNo": "12736213121736", "PremiumType": "Premium" }
    ]
  }];

  testData2: any = [{
    "NRIC": "xxxxxx",
    "Name": "xxxxxx",
    "SignatureMatch": "0.99",
  },
  {
    "NRIC": "xxxxxx",
    "Name": "xxxxxx",
    "SignatureMatch": "0.99"
  }];

  cols: any[] = [
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
  ];

  nestedCols: any[] = [
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
  ];

  constructor(private fluidModalService: FluidModalService,
              private confirmDialogService : ConfirmDialogService) { }

  ngOnInit() {


    this.testConfig.hoverable = true;
    //this.testConfig.hasBorders = true;
    //this.testConfig.hasStripes = true;
    this.testConfig.hasButton = true;
    //this.testConfig.hasCheckBox = true;
    this.testConfig.columns = this.cols;
    this.testConfig.nestedColumns = this.nestedCols;
    this.testConfig.value = this.testData1;

    //this.testConfig.value = this.testData2;
  }

  //on button click
  onClick(event) {
    console.log(event);
    let rowData = event.rowData;
    let customer = event.customer;
    console.log(rowData);

    let message = customer.Name + " will receive the following message: \n\n Dear Customer, Please verify that you had made a payment of S$800 to Prudential. To verify, please reply with your POLICY NUMBER. Please ignore this message if you are not the intended recipient."

    let data = {
      header: "Cheque details",
      imageUrl: "xxxx", //TODO: check how to pass image data to modal
      description: message,
      positive: "Send",
      negative: "Cancel"
    }
    this.confirmDialogService.openDialog(data);

  }

  onClickDetails(event) {
    console.log("details clicked");
    let data = {
      header: "Cheque details",
      imageUrl: "xxxx", //TODO: check how to pass image data to modal
      description: "this is a joke how to pass image gonna fail this hackathon YEET"
    }
    this.fluidModalService.openFluidModal(data);
  }

  //on checkbox click
  onChecked(event) {
    console.log(event);
  }

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