import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(private router: Router) { }

  tab: number = 2;
  ngOnInit() {
  }

  @Output() changeTabs = new EventEmitter<any>();
  changeTab(selectNum) {
    this.tab = selectNum;
    this.changeTabs.emit(selectNum);
  }

  onBack() {
    this.tab = 2
    this.changeTabs.emit(this.tab);
    this.router.navigate(['/home']);
  }
}
