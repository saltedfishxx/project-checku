import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor() { }

  tab: number;
  ngOnInit() {
  }

  @Output() changeTabs = new EventEmitter<any>();
  changeTab(selectNum){
    this.tab = selectNum;
    this.changeTabs.emit(selectNum);
  }
}
