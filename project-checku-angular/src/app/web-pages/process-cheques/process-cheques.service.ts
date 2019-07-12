import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiCallService } from '@apiService';

@Injectable({
  providedIn: 'root'
})
export class ProcessChequesService {

  constructor(private api: ApiCallService) {
  }

  tabToLoad: BehaviorSubject<any> = new BehaviorSubject<any>("review");
  tabSource: Observable<any> = this.tabToLoad.asObservable();
  processedCheques: any;
  reviewCheques: any[];
  rejectCheques: any[];
  successCheques: any[];
  reviewCount: number;
  rejectCount: number;
  successCount: number;

  getAllCheques() {
    return new Promise((resolve, reject) => {
      this.api.getRecords('./assets/jsonData/processed_cheques.json').then((res: any) => {
        resolve(res.data);
      });
    });
  }

  getProcessedCheques(tab) {
    return new Promise((resolve, reject) => {
      this.api.getRecords('./assets/jsonData/processed_cheques.json').then((res: any) => {
        this.processedCheques = res.data;
        this.reviewCheques = this.processedCheques['reviewCheques'];
        this.rejectCheques = this.processedCheques['rejectedCheques'];
        this.successCheques = this.processedCheques['successfulCheques']

        console.log(this.processedCheques);
        switch (tab) {
          case 'review':
            resolve(this.reviewCheques);
            break;
          case 'reject':
            resolve(this.rejectCheques);
            break;
          case 'success':
            resolve(this.successCheques);
            break;
        }
      });
    });

  }

  changePage(tabName) {
    this.tabToLoad.next(tabName);
  }

  getCurrentPage() {
    return this.tabSource;
  }

}
