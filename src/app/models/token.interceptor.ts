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
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEifQ.eyJpc3MiOiAiaHR0cHM6Ly9tb25jb21wdGUtZGV2LmFic3lzLmZyIiwgImlhdCI6IDE2MzQ1NjgzNzQsICJleHAiOiAxNjM0NTcxOTc0LCAia2lkIjogIjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEiLCAianRpIjogIlQtMTBlZTUxZTY4MDYxNGY3OWFhNDc3ZTAyZDcwNTM4MDAiLCAiYXVkIjogWyJsc1d5aFNacXU3WDkiLCAiNEpFNWpZSjdDeU5rIiwgIkhndzJPSFhQa01SQSJdLCAic2NvcGUiOiAib3BlbmlkIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHByb2ZpbGUgaHR0cHM6Ly9zYXJhLWRldi5hYnN5cy5mciBodHRwczovL3NlcmEtZGV2LmFic3lzLmZyIiwgInN1YiI6ICJhYmEwZDRlY2Q0YmY2MmI5YmUyZGY4ZTc1NjgxZTE4NDhkMjAxMGE0MTkwOWI1ZGI0NTgwNDI3MmIwNjkyZWIwIiwgImF6cCI6ICJIZ3cyT0hYUGtNUkEifQ.BpbsS10_P7pr3CX6HRTkjaRlSq1XJPhihjUKeuKa_gGe8LF-y-Fiy2TvqgJDZAxAC9Ax2uR8r9Gz_QTPcOARq7o6Miw4as-4LDi3a26Ivt6yzRpS7BeTe_zfnnRKKBouHgklDRfVbL1YprjcDN9hblGEu27CL0j1LUkwtz_Q3ahJV3v65fi16GfdREO_4lNDlHIeHlchfP8rUkI31RTvMP3UXHNhQp_YQ8XhQZSIZkVZAUm3-I5al1ypnuPukUvSQpZ9LyTp_bPXTo0ZxHfJbqAzoneN982tJQqIZ8wgPkY0Tw5DBg4l_cw25W3M5StIJS7delNhzez6gEByUFPUDw'
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
