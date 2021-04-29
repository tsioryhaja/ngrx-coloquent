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
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEifQ.eyJpc3MiOiAiaHR0cHM6Ly9tb25jb21wdGUtZGV2LmFic3lzLmZyIiwgImlhdCI6IDE2MTk1MjE3NzMsICJleHAiOiAxNjE5NTI1MzczLCAia2lkIjogIjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEiLCAianRpIjogIlQtMDc1MTYxNzJjYTBlNGJhM2E1NTNlNjY3YTFmMDcwMDAiLCAiYXVkIjogWyJsc1d5aFNacXU3WDkiLCAiNEpFNWpZSjdDeU5rIiwgIkhndzJPSFhQa01SQSJdLCAic2NvcGUiOiAib3BlbmlkIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHByb2ZpbGUgaHR0cHM6Ly9zYXJhLWRldi5hYnN5cy5mciBodHRwczovL3NlcmEtZGV2LmFic3lzLmZyIiwgInN1YiI6ICJhYmEwZDRlY2Q0YmY2MmI5YmUyZGY4ZTc1NjgxZTE4NDhkMjAxMGE0MTkwOWI1ZGI0NTgwNDI3MmIwNjkyZWIwIiwgImF6cCI6ICJIZ3cyT0hYUGtNUkEifQ.JrWDs_zrU-WJy8nJPHhoA-R_hODEVyh3VzVe4jWO4TgucVQqdeMUQ_c6g6t4MBUicWkrRbhoGMQALpMnVGCfATs6-ZcVqhN0_w0rga3BX4wa2ECGbk1s3hncgkGQXx1MbEOBJ3WwN-g__0qskR6aJh9jqeplOSK2CDZ1dBszQWXSOTKxOlP_rHwdX_WGONkvfxkTwbM6H9nAApJvDt6ntHgOFTv_quqeQMeFy4N4_JFLag4m48ljAfp7KB0-J-z-YoGF1Rd6Jj-2Y5kNHqTW3LLYWW6_T1Ak8CPR_T4H-u46FKJUijVoioyq1qAK1Hng-F5o-21jghtMpRsWt5dy3Q'
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
