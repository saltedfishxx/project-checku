import { Component, OnInit } from '@angular/core';
import { ProcessChequesService } from './process-cheques.service';

@Component({
  selector: 'app-process-cheques',
  templateUrl: './process-cheques.component.html',
  styleUrls: []
})
export class ProcessChequesComponent implements OnInit {

  constructor(private processChqeSvc: ProcessChequesService) { }

  currentPage: string;

  ngOnInit() {

    this.processChqeSvc.getProcessedCheques().then(isLoaded => {
      if (isLoaded) {
        console.log("@processChqe: retrieved processed cheques.");
        this.processChqeSvc.getCurrentPage().subscribe(page => {
          this.currentPage = page;
        });
      }
    });
  }

  changePage(number) {
    switch (number) {
      case 1:
        this.processChqeSvc.changePage('reject');
        break;
      default:
      case 2:
        this.processChqeSvc.changePage('review');
        break;
      case 3:
        this.processChqeSvc.changePage('accept');
        break;
    }
  }
}
