import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http : HttpClient) { }

  //GET
  getRecords(requestUrl) {
    return new Promise((resolve, reject) => {

      this.http.get(requestUrl).subscribe(response => {
        resolve(response);
      },
      errorResponse => {
        reject(errorResponse);
      });
    });
  }

  //POST
  login(requestUrl, data){
    return new Promise((resolve, reject) => {

      this.http.post(requestUrl, data).subscribe(response => {
        resolve(response);
      },
      errorResponse => {
        reject(errorResponse);
      });
    });
  }

  processScannedCheques(requestUrl, data) {
    return new Promise((resolve, reject) => {

      this.http.post(requestUrl, data).subscribe(response => {
        resolve(response);
      },
      errorResponse => {
        reject(errorResponse);
      });
    });
  }

  addRecords(requestUrl, data) {
    return new Promise((resolve, reject) => {

      this.http.post(requestUrl, data).subscribe(response => {
        resolve(response);
      },
      errorResponse => {
        reject(errorResponse);
      });
    });
  }


}
