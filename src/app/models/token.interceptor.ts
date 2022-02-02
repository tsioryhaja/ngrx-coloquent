import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgrxColoquentBaseRequestErrorInterface } from "projects/ngrx-coloquent/src/public-api";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer '
            }
        });
        return next.handle(request);
    }
}

@Injectable()
export class ErrorInjector implements NgrxColoquentBaseRequestErrorInterface {
    call(action, error) {
        console.error(error);
        console.log(action);
    }
}
