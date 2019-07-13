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
  rejectChequesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  reviewChequesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  successChequesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  getProcessedCheques() {
    return new Promise((resolve, reject) => {
      this.api.getRecords('./assets/jsonData/processed_cheques.json').then((res: any) => {
        this.processedCheques = res.data;
        this.reviewCheques = this.processedCheques['reviewCheques'];
        this.rejectCheques = this.processedCheques['rejectedCheques'];
        this.successCheques = this.processedCheques['successfulCheques'];

        this.updateRejectCheques(this.rejectCheques);
        this.updateReviewCheques(this.reviewCheques);
        this.updateSuccessCheques(this.successCheques);

        console.log("@processChqe: received data: ");
        console.log(this.processedCheques);
        resolve(true);
      });
    });

  }

  changePage(tabName) {
    this.tabToLoad.next(tabName);
  }

  getCurrentPage() {
    return this.tabSource;
  }

  updateReviewCheques(reviewCheques) {
    this.reviewChequesSubj.next(reviewCheques);
  }

  updateRejectCheques(rejectCheques) {
    this.rejectChequesSubj.next(rejectCheques);
  }

  updateSuccessCheques(successCheques) {
    this.successChequesSubj.next(successCheques);
  }

  getLatestCheque(type) {
    switch (type) {
      case 'review':
        return this.reviewChequesSubj.asObservable();
      case 'reject':
        return this.rejectChequesSubj.asObservable();
      case 'success':
        return this.successChequesSubj.asObservable();
    }
  }

}
