import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { URLS } from './urls';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods' : '*',
        'Access-Control-Allow-Headers': '*'
    });
    const apiReq = req.clone({ headers: headers, url: URLS.APP_HOST + `${req.url}` });
    return next.handle(apiReq);
  }
}