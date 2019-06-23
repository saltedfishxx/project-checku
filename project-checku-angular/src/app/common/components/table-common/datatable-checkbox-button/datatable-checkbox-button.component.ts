import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable.component';
import { all } from 'q';

@Component({
  selector: 'datatable-checkbox-button',
  templateUrl: './datatable-checkbox-button.component.html',
  styleUrls: ['./datatable-checkbox-button.component.scss']
})
export class DatatableCheckboxButtonComponent extends DatatableComponent implements OnInit {

  constructor() {
    super();
  }

  @Input() buttonText: string = "";
  @Input() buttonColor: string = "";
  selectAll: boolean = false; //to select all checkbox
  allChecked: boolean = false; //to select the top checkbox
  selectedRows: any[] = [];

  ngOnInit() {
  }

  setPercentColor(data, isPercent) {
    if (isPercent == true) {
      let value = parseFloat(data);
      if (value > 0.8)
        return "text-success";
      else if (value < 0.8 && value > 0.6)
        return "text-warning";
      else
        return "text-danger";
    }
  }


  //button events
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  onButtonClick(rowData, customer) {
    this.clicked.emit({ rowData, customer });
  }

  onButtonClickNormal(customer) {
    this.clicked.emit(customer);
  }


  //checkbox events
  @Output() rowSelect: EventEmitter<any> = new EventEmitter<any>();
  onRowSelect(event, rowData, rowIndex, allData) {
    let checkBoxId = rowIndex;
    let isChecked = event.checked;
    console.log("checkbox data: " + checkBoxId + isChecked);

    if (this.selectedRows.length > 0) {
      if (this.selectedRows.length == allData.length) {
        this.allChecked = true;
        for (let i in this.selectedRows) {
          let index: number = parseInt(i);
          if (checkBoxId === this.selectedRows[i].id && isChecked === false) {
            console.log("removing row to selected rows");
            this.selectedRows.splice(index, 1);
            this.allChecked = false;
          }
        }
      } else {
        for (let i in this.selectedRows) {
          let index: number = parseInt(i);
          if (checkBoxId === this.selectedRows[i].id && isChecked === false) {
            console.log("removing row to selected rows");
            this.selectedRows.splice(index, 1);
          }
          else {
            this.selectedRows.push({ id: checkBoxId, rowData: rowData });
            if (this.selectedRows.length == allData.length)
              this.allChecked = true;
            else
              this.allChecked = false;
          }
        }
      }
    } else {
      console.log("adding row to selected rows");
      this.selectedRows.push({ id: checkBoxId, rowData: rowData });
      if (this.selectedRows.length == allData.length)
        this.allChecked = true;
      else
        this.allChecked = false;
    }

    this.rowSelect.emit(this.selectedRows);
  }

  onSelectAll(event, allData) {
    console.log(event)
    this.selectAll = event.checked;
    this.allChecked = event.checked;

    if (this.selectAll) {
      allData.forEach((item, index) => {
        this.selectedRows.push({ id: index, rowData: item });
      });
    } else {
      this.selectedRows = [];
    }


    this.rowSelect.emit(this.selectedRows);
  }

}
