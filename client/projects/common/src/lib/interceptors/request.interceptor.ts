import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

import { DataStoreService } from '../services/data-store.service';
import { HttpStatusCode } from '../types/http-status-codes';
import { NotificationService } from '../services/notification.service';
import { NotificationMessageKeys } from '../constants/notification.message.keys';
@Injectable({
    providedIn: 'root',
})
export class RequestInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private dataStoreService: DataStoreService,
        private notificationService: NotificationService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headers = req.url.includes('/file/') && req.url.endsWith('/upload') ? {} : { 'Content-Type': 'application/vnd.api+json' };
        return from(this.dataStoreService.get('user-token', false)).pipe(
            switchMap((userToken) => {
                if (!req.url.includes('/auth/signin') && userToken && userToken.token) {
                    headers['Authorization'] = `Bearer ${
                        req.url.indexOf('auth/token/refresh') >= 0 ? userToken.refresh : userToken.token
                    }`;
                }
                return from(this.dataStoreService.get('x-xsrf-token'));
            }),
            switchMap((xsrf) => {
                if (req.method.toLowerCase() !== 'get' && xsrf) {
                    headers['x-xsrf-token'] = xsrf;
                    this.dataStoreService.push('x-xsrf-token', null);
                }

                return from(this.dataStoreService.get('recaptcha-token'));
            }),
            switchMap((reCaptchaToken) => {
                if (req.url.includes('verify/recaptcha') && req.method.toLowerCase() === 'post' && !!reCaptchaToken) {
                    headers['x-recaptcha-token'] = reCaptchaToken;
                    this.dataStoreService.push('recaptcha-token', null);
                }

                req = req.clone({
                    withCredentials: true,
                    setHeaders: headers,
                });

                return next.handle(req).pipe(
                    tap(async (evt) => {
                        if (!req.url.includes('/auth/token/xsrf/') && evt instanceof HttpResponse) {
                            await this.dataStoreService.push('x-xsrf-token', evt.headers.get('x-xsrf-token'));
                        }

                        if (evt instanceof HttpErrorResponse && evt.status === HttpStatusCode.Unauthorized) {
                            this.router.navigateByUrl('/signin');
                        } else if (evt instanceof HttpErrorResponse) {
                            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
                        }
                    })
                );
            })
        );
    }
}
