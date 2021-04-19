import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEifQ.eyJpc3MiOiAiaHR0cHM6Ly9tb25jb21wdGUtZGV2LmFic3lzLmZyIiwgImlhdCI6IDE2MTg4MzgzMTIsICJleHAiOiAxNjE4ODQxOTEyLCAia2lkIjogIjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEiLCAianRpIjogIlQtNzhmZDliNzI4MDdmNDZkMDllYzg5YTA2ZTYzNzM4NzQiLCAiYXVkIjogWyJsc1d5aFNacXU3WDkiLCAiNEpFNWpZSjdDeU5rIiwgIkhndzJPSFhQa01SQSJdLCAic2NvcGUiOiAib3BlbmlkIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHByb2ZpbGUgaHR0cHM6Ly9zYXJhLWRldi5hYnN5cy5mciBodHRwczovL3NlcmEtZGV2LmFic3lzLmZyIiwgInN1YiI6ICJhYmEwZDRlY2Q0YmY2MmI5YmUyZGY4ZTc1NjgxZTE4NDhkMjAxMGE0MTkwOWI1ZGI0NTgwNDI3MmIwNjkyZWIwIiwgImF6cCI6ICJIZ3cyT0hYUGtNUkEifQ.puhDPgoXnDGckYCYlxEQwwg6DucUOLzoelqAW4m0mUXDJVDSI6HDDQysBEerV77wNzZ3I-iM0aS2q3xdkljeLc72Ho-RIsKjiosdEF8sKI76mQyM79gKxqrGREY4Z9r2XqbnG0Hdcik8DMDRtVIFYkleMzp8AjIF_HkMW1V6U7agwZeTU2xTUta_KhmYkXGTL2NWwU8u3OYsKxg4DikVcBx0XjO6haH52BVCcGhnxTT8wFwE5jHptv3y2DowoZDzQgxYE-qBs4OJv-9R2CnWcBUZgqsX5N8WENuCLDi7nI1gevJYv36nWs7yACDFxvIC0vn9oSXBE1rPUUsieDRURg'
            }
        });
        return next.handle(request);
    }
}
