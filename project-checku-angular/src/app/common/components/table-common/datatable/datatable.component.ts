import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter, HostListener } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {

  @Input() config: any;
  onChangeSubscription: Subscription;
  toggleButton: boolean = false;
  selectedSortHeader: any;

  constructor() { }

  ngOnInit() {
    if (this.config) {
      this.onChangeSubscription = this.config.onChange().subscribe(() => {
        this.parseInput(this.config);
      });
    }
  }

  ngOnDestroy() {
    if (this.onChangeSubscription) {
      this.onChangeSubscription.unsubscribe();
    }
  }

  /**
   * Invoked once before ngOnInit. Then invoked everytime on input reference changes.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    const valueSimpleChange: SimpleChange = changes.config;

    if (valueSimpleChange && valueSimpleChange.currentValue) {
      this.parseInput(valueSimpleChange.currentValue);

      if (this.onChangeSubscription) {
        this.onChangeSubscription.unsubscribe();
      }

      this.onChangeSubscription = valueSimpleChange.currentValue.onChange().subscribe(() => {
        this.parseInput(this.config);
      });
    }
  }

  setSortField(header) {
    this.selectedSortHeader = header;
    this.toggleButton = !this.toggleButton;
  }

  getSortField(header) {
    return this.selectedSortHeader == header;
  }

  protected parseInput(inputValue: TableConfig) {
    console.log("refreshed table");
    this.selectedRows = [];
    this.selectAll = false;
    this.allChecked = false;

    if (inputValue.value) {
      if (!inputValue.valueBkup) {
        // do not overwrite bkup value if there is existing
        // because input value could be filtered already
        this.config.valueBkup = JSON.parse(JSON.stringify(inputValue.value));
      }
    }
  }

  //Check if value passed in is numeric
  checkNumeric(value) {
    return /\d+(\.\d*)?|\.\d+/g.test(value) && value != null && value != '';
  }

  //Check progress bar status
  checkProgess(value) {
    switch (parseFloat(value)) {
      case 1:
        return '30%';
      case 2:
        return '60%';
      case 3:
        return '100%';

    }
  }

  //set styles for cells with percentage
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

  //button properties
  @Input() buttonText: string = "";
  @Input() buttonColor: string = "";
  @Input() buttonWidth: string = "110px";

  //button events
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  onButtonClickNormal(rowData, i) {
    this.clicked.emit({ rowData, i });
  }

  checkbuttonDisable(index) {
    let id = this.buttonText + index + this.config.currentPage;
    let isDisabled = false;
    for (let element of this.config.disableButtonsList) {
      if (id == element) {
        isDisabled = true;
        break;
      }
    };
    return isDisabled;
  }

  //checkbox events
  onRowRemove(event) {
    console.log("row removed");
  }

  @Output() rowSelect: EventEmitter<any> = new EventEmitter<any>();
  selectedRows: any[] = [];
  allChecked: boolean = false;
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
      if (isChecked == true) {
        console.log("adding row to selected rows");
        this.selectedRows.push({ id: checkBoxId, rowData: rowData });
        if (this.selectedRows.length == allData.length)
          this.allChecked = true;
        else
          this.allChecked = false;
      }
    }


    console.log(this.selectedRows);
    this.rowSelect.emit(this.selectedRows);
  }

  selectAll: boolean = false;
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

  //dropdown event
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  onItemSelected(id, rowData) {
    this.itemClick.emit({ id, rowData });
  }
}


export class TableConfig {
  nestedColumns: any[];
  columns: any[]; //field, header, width, clickable, sortable, dateFormat, style, currency, hasDollar, hasBar, isStatus
  disableButtonsList: any[] = [];
  value: any[];
  valueBkup: any[]; // Backup value field when applying filter. Input not required
  disable: boolean = false;
  showPagination: boolean = true;

  hoverable: boolean = false;
  hasStripes: boolean = false;
  hasBorders: boolean = false;
  hasButton: boolean = false;
  hasCheckBox: boolean = false;
  hasHamburger: boolean = false;
  dropdownList: any[] = [];
  currentPage: any = 0;

  private onChangeSource = new BehaviorSubject(null);
  private onChange$ = this.onChangeSource.asObservable();
  minWidth: string;

  /**
   * call refresh() after TableConfig's fields are all updated to refresh datatable
   */
  refresh() {
    this.onChangeSource.next(true);
  }

  /**
   * Not for business pages' usage
   */
  onChange() {
    return this.onChange$.pipe(filter(value => value != null));
  }

  /*
   * reset filters on table
   */
  reset() {
    this.refresh();

  }

  addIndex(indexFieldName: string) {

    this.value.forEach((element, index) => {
      element[indexFieldName] = index + 1;
    });
    this.refresh();
  }
}