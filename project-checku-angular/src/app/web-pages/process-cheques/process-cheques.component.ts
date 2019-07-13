import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiCallService } from '@apiService';
import { TableConfig } from 'src/app/common/components/table-common/datatable/datatable.component';
import { ProcessChequesService } from './process-cheques.service';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-process-cheques',
  templateUrl: './process-cheques.component.html',
  styleUrls: []
})
export class ProcessChequesComponent implements OnInit {

  constructor(private processChqeSvc: ProcessChequesService) { }

  currentPage: string;

  ngOnInit() {
    this.processChqeSvc.getCurrentPage().subscribe(page => {
      this.currentPage = page;
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
