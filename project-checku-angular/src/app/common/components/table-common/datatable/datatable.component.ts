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

  ngOnDestory() {
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

  setSortField(header){
    this.selectedSortHeader = header;
    this.toggleButton = !this.toggleButton;
  }

  getSortField(header){
    return this.selectedSortHeader == header;
  }

  protected parseInput(inputValue: TableConfig) {
    if (inputValue.value) {
      const valuesFromInput = inputValue.value;
      if (!inputValue.valueBkup) {
        // do not overwrite bkup value if there is existing
        // because input value could be filtered already
        this.config.valueBkup = JSON.parse(JSON.stringify(inputValue.value));
      }
      this.config.totalRecords = valuesFromInput.length;


      this.config.valueToDisplay = valuesFromInput.slice(this.config.first,
        Math.min(this.config.first + this.config.rows, this.config.totalRecords));
      this.config.pageCount = Math.max(Math.ceil(this.config.totalRecords / this.config.rows), 1);
    }

    if (inputValue.columns) {
      inputValue.columns.forEach((element: any) => {
        if (element.field && Object.keys(this.config.filters).indexOf(element.field) < 0) {
          this.config.filters[element.field] = '';
        }

        this.filter();

  
      });

    }
  }


  paginate(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.config.first = event.first;
    this.config.rows = event.rows;
    this.config.pageCount = event.pageCount;
    this.config.valueToDisplay = this.config.value.slice(this.config.first,
      Math.min(this.config.first + this.config.rows, this.config.totalRecords));
    this.config.disable = false;
  }

  jumpTo: number;
  goToPage() {
    if (!!this.jumpTo && this.jumpTo <= this.config.pageCount) {
      this.config.first = this.config.rows * (this.jumpTo - 1);
      this.config.valueToDisplay = this.config.value.slice(this.config.first,
        Math.min(this.config.first + this.config.rows, this.config.totalRecords));
    }
    this.jumpTo = undefined;
  }

  get isOnLastPage(): boolean {
    return this.config.first + this.config.rows >= this.config.totalRecords;
  }

  filter() {
    var temp = [];
    if (!this.config.valueBkup) return;
    this.config.valueBkup.forEach(element => {
      var include = true;
      var cols = Object.keys(this.config.filters) as string[];
      for (var i = 0; i < cols.length; i++) {
        if (!!this.config.filters[cols[i]]) {
          // if not empty, do filter
          var lookfor = this.config.filters[cols[i]].toUpperCase();
          if (element[cols[i]].toString().toUpperCase().indexOf(lookfor) >= 0) {
            // pass
          } else {
            include = false;
            break;
          }
        }
      }
      if (include) {
        temp.push(element);
      }
    })
    this.config.value = temp;
    this.config.totalRecords = this.config.value.length;
    this.config.pageCount = Math.max(Math.ceil(this.config.totalRecords / this.config.rows), 1);
    this.config.first = Math.min(this.config.first, this.config.rows * (this.config.pageCount - 1));
    this.config.valueToDisplay = temp.slice(this.config.first,
      Math.min(this.config.first + this.config.rows, this.config.totalRecords));
  }


  //Check if value passed in is numeric
  checkNumeric(value) {
    return /\d+(\.\d*)?|\.\d+/g.test(value) && value != null && value !='';
  }

  //Check progress bar status
  checkProgess(value){
    switch(parseFloat(value)){
      case 1:
        return '30%';
      case 2:
        return '60%';
      case 3:
        return '100%';

    }
  }
}

/**
 * @function refresh call refresh() after TableConfig's fields are all updated
 * @param columns field, header, width, clickable, sortable, dateFormat, style
 * @param value array of objects
 * @param headerHeight height of table header (only applicable when table has fixed col)
 * @param headerWidth width of table header (only applicable when table has fixed col)
 * @param rowHeight height of row (only applicable when table has fixed col)
 * @param disable disable paginator. default to false
 * @param minWidth when parent element width < minWidth, display horizontal scroll bar (requires scrollable set to true)
 * @param rowsPerPage options in paginator pagesize dropdown
 * @param displayEOT if to display End Of Table. default to false;
 */
export class TableConfig {
  nestedColumns: any[];
  columns: any[]; //field, header, width, clickable, sortable, dateFormat, style, currency, hasDollar, hasBar, isStatus
  /*
  ex)
  Currency is to display numbers in the table. it align the text to right and add comma.
  However, it doesn't include crrency symbol behind
  80000   =>  80,000

  if you want to include numbers after decimal point ( 8000.123 ), follow below
  { currency : '.2-2'  // how many digits want to show after decimal point. {minFractionDigits}-{maxFractionDigits}.
                       // number 2345.23434  =>  2345.23
  }
  else, you don't want to show.
  {
    currency : '.0-0'
  }
  ex)
  {
    style : {'text-align':'right'}, //don't use "" quotation mark
  }

  */

  disableButtonsList: any[];
  /**
   * E.g. disableButtonsList = [
   * [true, true, false], //if no. of buttons generated per row is 3, this array will have 3 values
   * [true, false, false]
   * ]
   *
   * This disableButtonsList is used to determine which buttons on a row is disabled,
   * business forms will have to generate this list by themselves, using their own conditions
   * to determine what button is disabled (refer to table demo)
   */

  stretchedHeaderList = []; //list of rows of headers that is spanned across columns in data table
  stretchedHeaderHeight: string = '50px'; //height of the extra header row
  /**
   * format in stretchedHeaderList:
   [{
         name: 'header 1', //name of header
         colspan: 3        //number of columns the header will stretch
       },
   {
         name: 'header 2',
         colspan: 1
       }];
   * IMPORTANT: the sum of colspan the row of extra header must not exceed the total number of columns
   * in the datatable
   */

  // only applicable when table has fixed col //300px
  headerHeight: string = '75px'; // only applicable when table has fixed col
  headerWidth: string = '120px'; // only applicable when table has fixed col
  rowHeight: string = '75px'; // only applicable when table has fixed col
  value: any[];
  valueToDisplay: any[]; // Determines which rows to display on current page. Input not required
  rows: number = 10; // Number of rows to display in new page.
  first: number = 0; // Index of the first record. 
  page: number = 0; // Index of the new page.
  pageCount: number; // Total number of pages. Input not required
  totalRecords: number = 0; // Length of value. Input not required
  valueBkup: any[]; // Backup value field when applying filter. Input not required
  filters: any = {}; // Filter object. Input not required
  sortBy: any; // Sort order. Input not required
  displayFilters: boolean = true;
  sortOrder: number = 1; // 1 if is asc, -1 otherwise
  disable: boolean = false;
  clickable: boolean = false; // if the overall row is clickable or not
  hoverable: boolean = false;
  hasStripes: boolean = false;
  hasBorders: boolean = false;

  // when parent element width < minWidth, display horizontal scroll bar
  minWidth: string = '640px'; // only applicable when table is scrollable
  //to modify rows per page options
  //rowsPerPage : number[] = [10,20,30];
  rowsPerPage: any = [
    { label: 'Rows per page: 10', value: 10 },
    { label: 'Rows per page: 20', value: 20 },
    { label: 'Rows per page: 30', value: 30 },
    { label: 'Rows per page: All', value: "All" }
  ];
  displayEOT: boolean = false; // flag for displaying end of table
  resizable: boolean = false;
  private onChangeSource = new BehaviorSubject(null);
  private onChange$ = this.onChangeSource.asObservable();
  /**
   * call refresh() after TableConfig's fields are all updated to refresh datatable
   */
  refresh() {
    this.onChangeSource.next(true);
  }



  mergeDataset(value, disableButtonsList) {
    if (disableButtonsList) {
      if (value.length == disableButtonsList.length) {
        value.forEach((element, index) => {
          element['disable'] = disableButtonsList[index];
        });
        this.value = value;
      } else {
        this.value = value;
      }

    } else {
      this.value = value;
    }
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
    this.filters = {}; // Filter object. Input not required
    this.sortBy = {};
    this.sortOrder = 1;
    this.refresh();

  }

  /**
   * Add index automatically
   * ex) in your component,
   *     // this.dataConfig.value = dataset //set value first.
   *      this.dataConfig.addIndex("specify your index column field");
   *
   *
   *
   * @param indexFieldName index field name
   */
  addIndex(indexFieldName: string) {

    this.value.forEach((element, index) => {
      element[indexFieldName] = index + 1;
    });
    this.refresh();
  }
}