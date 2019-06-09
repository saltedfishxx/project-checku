import { Component, OnInit } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable.component';

@Component({
  selector: 'app-datatable-checkbox-button',
  templateUrl: './datatable-checkbox-button.component.html',
  styleUrls: ['./datatable-checkbox-button.component.scss']
})
export class DatatableCheckboxButtonComponent extends DatatableComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
