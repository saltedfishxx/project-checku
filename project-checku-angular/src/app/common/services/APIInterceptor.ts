import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { URLS } from '@urls';
import { Observable } from 'rxjs';
import { LoadingScreenService } from './loading-screen.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  activeRequests: number = 0;
  APP_HOST = "http://localhost:5000/";
  stubData: boolean = true;

  constructor(private loadingScreenService: LoadingScreenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loadingScreenService.startLoading();
    }

    this.activeRequests++;
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    });

    //FOR TESTING: uses local assets to subsitiute data received 
    if (this.stubData) {
      this.APP_HOST = "http://localhost:4200/";
    }

    const apiReq = req.clone({ headers: headers, url: this.APP_HOST + `${req.url}` });

    return next.handle(apiReq).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loadingScreenService.stopLoading();
        }
      })
    );
  }
}