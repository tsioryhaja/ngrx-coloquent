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
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEifQ.eyJpc3MiOiAiaHR0cHM6Ly9tb25jb21wdGUtZGV2LmFic3lzLmZyIiwgImlhdCI6IDE2MjIwMjk0MjEsICJleHAiOiAxNjIyMDMzMDIxLCAia2lkIjogIjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEiLCAianRpIjogIlQtMDVhNGFkNjNiMmUwNDA5NmIwYzM4YzczYTE3OTdkMzIiLCAiYXVkIjogWyJsc1d5aFNacXU3WDkiLCAiNEpFNWpZSjdDeU5rIiwgIkhndzJPSFhQa01SQSJdLCAic2NvcGUiOiAib3BlbmlkIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHByb2ZpbGUgaHR0cHM6Ly9zYXJhLWRldi5hYnN5cy5mciBodHRwczovL3NlcmEtZGV2LmFic3lzLmZyIiwgInN1YiI6ICJhYmEwZDRlY2Q0YmY2MmI5YmUyZGY4ZTc1NjgxZTE4NDhkMjAxMGE0MTkwOWI1ZGI0NTgwNDI3MmIwNjkyZWIwIiwgImF6cCI6ICJIZ3cyT0hYUGtNUkEifQ.GhUqm1kyawVCVWpWVy-Qt3Dn4TW-YvqHlXCzCPRAP4VwQwf-5iP5wyg7nwm9duhtOgclu2TViNCPIl41MhpXVRJsA33JIdRQyFYvIIHSiGvkn-i8OV7eBh9WJMKHkAagruX9cF_uSa6lwcVm4Ky5cIO-JRB0yYl7_Qxn6nLS4QBfIzKj7TQNiE5993WDerWyRJNPCvEW3BIntVcI-DJOCOTKtJFYbezIk55KPsuPrFPrL9D70QZazQKmBvEkjo-HM41HflFaFcZnn7c063O1ZBJWwDNjah9yjBJmuTocUvI05fMoIGaKabgtXXk3tIbqBw5-52z5u9FbpKSVfGiqfQ'
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
