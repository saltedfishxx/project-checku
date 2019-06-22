import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable.component';

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

  ngOnInit() {
  }

  setPercentColor(data, isPercent){
    if(isPercent == true){
      let value = parseFloat(data);
      if(value > 0.8)
        return "text-success";
      else if (value < 0.8 && value > 0.6)
        return "text-warning";
      else
        return "text-danger";
    }
  }

  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  onButtonClick(rowData, customer) {
      this.clicked.emit({rowData, customer});

  }

  onButtonClickNormal(customer) {
    this.clicked.emit(customer);

}

}
