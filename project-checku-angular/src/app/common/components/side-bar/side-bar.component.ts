import { Component, OnInit } from '@angular/core';

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

  changeTab(selectNum){
    this.tab = selectNum;
  }
}
