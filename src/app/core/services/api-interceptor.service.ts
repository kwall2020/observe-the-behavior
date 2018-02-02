import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Store } from '@ngrx/store';

 import {CoreState } from '../store';
 import * as AppActions from '../store/actions/app.action';

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {
  constructor(private store: Store<CoreState>) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest: HttpRequest<any>;

    if (request.url.startsWith(environment.navitaireApiUrl)) {
      const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': environment.navitaireSubscriptionKey,
      };

      if (!(request.url.endsWith('token') && request.method === 'POST')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      newRequest = request.clone({
        setHeaders: headers
      });
    } else {
      newRequest = request;
    }

    this.store.dispatch(new AppActions.SetLoading(true));
    return next.handle(newRequest)
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          console.error(response);
        }
        return Observable.throw(response);
      })
      .finally(() => this.store.dispatch(new AppActions.SetLoading(false)));
  }
}
