import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'hamburger-dropdown',
  templateUrl: './hamburger-dropdown.component.html',
  styleUrls: ['./hamburger-dropdown.component.scss']
})
export class HamburgerDropdownComponent implements OnInit {

  constructor() { }

  @Input() icon: string = "";
  @Input() config: any = [];
  isOpened: boolean = false;

  ngOnInit() {
  }

  isOpenChange(event) {
    this.isOpened = event;
  }

  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  onItemSelected(id) {
    this.itemClick.emit(id);
  }

  setIconColor(color) {
    switch (color) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary"
      case "success":
        return "text-success";
      case "info":
        return "text-info";
      case "warning":
        return "text-warning";
      case "danger":
        return "text-danger";
      case "grey":
        return "text-grey";
      case "light":
        return "text-light";
      case "dark":
        return "text-dark";
    }
  }
}
