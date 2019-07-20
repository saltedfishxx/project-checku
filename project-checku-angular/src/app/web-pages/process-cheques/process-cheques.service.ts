import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiCallService } from '@apiService';
import { URLS } from '@urls';

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
  responseData: any;

  /****** GET METHODS  *******/
  getProcessedCheques() {
    return new Promise(resolve => {
      this.getReviewCheques().then((res: any) => {
        console.log("🤙 Received review cheques");
        console.log(res);
        this.reviewCheques = res.data;
        this.updateReviewCheques(this.reviewCheques);
      });
      // this.getRejectCheques().then((res: any) => {

      // });
      this.rejectCheques = [];
      this.updateRejectCheques(this.rejectCheques);

      this.getSuccessCheques().then((res: any) => {
        this.successCheques = res.data;
        this.updateSuccessCheques(this.successCheques);
      });

      resolve(true);
    });
  }


  getReviewCheques() {
    if (URLS.stubData) {
      return this.api.getRecords('./assets/jsonData/processed_cheques_review.json')
    } else {
      return this.api.getRecords(URLS.GET_PROCESSED_CHEQUES + "?status=review")
    }
  }

  // getRejectCheques() {
  //   //if (URLS.stubData) {
  //   return this.api.getRecords('./assets/jsonData/processed_cheques_reject.json')
  //   // } else {
  //   //   return this.api.getRecords(URLS.GET_PROCESSED_CHEQUES + "?status=reject")
  //   // }
  // }

  getSuccessCheques() {
    if (URLS.stubData) {
      return this.api.getRecords('./assets/jsonData/processed_cheques_success.json')
    } else {
      return this.api.getRecords(URLS.GET_PROCESSED_CHEQUES + "?status=success")
    }
  }

  /****** ADD TO DB METHODS  *******/
  addReviewCheques(data) {
    return this.api.addRecords(URLS.POST_CONFIRMED_CHEQUES + '?status=review', data);
  }

  addRejectCheques(data) {
    return this.api.addRecords(URLS.POST_CONFIRMED_CHEQUES + '?status=reject', data);
  }

  addSuccessCheques(data) {
    return this.api.addRecords(URLS.POST_CONFIRMED_CHEQUES + '?status=success', data);
  }

  sendSms(data) {
    return this.api.sendSMS(URLS.POST_SMS, data);
  }

  changePage(tabName) {
    this.tabToLoad.next(tabName);
  }

  getCurrentPage() {
    return this.tabSource;
  }

  //listener to update remainng processing cheques
  updateReviewCheques(reviewCheques) {
    this.reviewCheques = reviewCheques
    this.reviewChequesSubj.next(reviewCheques);
  }

  updateRejectCheques(rejectCheques) {
    this.rejectCheques = rejectCheques;
    this.rejectChequesSubj.next(rejectCheques);
  }

  updateSuccessCheques(successCheques) {
    this.successCheques = successCheques;
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

  setUnfinishedCheques() {
    // let count = this.successCheques.length + this.rejectCheques.length + this.reviewCheques.length;
    // localStorage.setItem("processCount", count.toString());
  }

}
