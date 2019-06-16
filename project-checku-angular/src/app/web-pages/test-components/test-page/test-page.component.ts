import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

  testConfig: TableConfig = new TableConfig();
  constructor() { }

  ngOnInit() {
    let cols : any = [
      {
        header: 'header 1',
        field: 'data1',
        width: '10%'
      },
      {
        header: 'header 2',
        field: 'data2',
        width: '10%'
      },
      {
        header: 'header 3',
        field: 'smsStatus',
        width: '10%',
        isStatus: true
      },
      {
        header: 'header 4',
        field: 'data4',
        width: '10%',
        hasBar: true
      }
    ]

    this.testConfig.hoverable = true;
    this.testConfig.columns = cols;
    this.testConfig.value = [{"data1" : "what", "data2" : "neni", "smsStatus" : "pending", "data4": "1"}, 
                             {"data1" : "what", "data2" : "neni", "smsStatus" : "verified", "data4": "2"},
                             {"data1" : "what", "data2" : "neni", "smsStatus" : "unverified", "data4": "3"}];
  }

}
