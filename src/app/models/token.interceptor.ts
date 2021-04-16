import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEifQ.eyJpc3MiOiAiaHR0cHM6Ly9tb25jb21wdGUtZGV2LmFic3lzLmZyIiwgImlhdCI6IDE2MTg1ODI2MTksICJleHAiOiAxNjE4NTg2MjE5LCAia2lkIjogIjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEiLCAianRpIjogIlQtOTdiZjVmMDFiZmY2NDU0YTlkMjNkZDg2YzY3ZWRiNzYiLCAiYXVkIjogWyJsc1d5aFNacXU3WDkiLCAiNEpFNWpZSjdDeU5rIiwgIkhndzJPSFhQa01SQSJdLCAic2NvcGUiOiAib3BlbmlkIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHByb2ZpbGUgaHR0cHM6Ly9zYXJhLWRldi5hYnN5cy5mciBodHRwczovL3NlcmEtZGV2LmFic3lzLmZyIiwgInN1YiI6ICJhYmEwZDRlY2Q0YmY2MmI5YmUyZGY4ZTc1NjgxZTE4NDhkMjAxMGE0MTkwOWI1ZGI0NTgwNDI3MmIwNjkyZWIwIiwgImF6cCI6ICJIZ3cyT0hYUGtNUkEifQ.e5223lRYCd7Lf5R3wxiDmRK6ib9FTuKZ5x_k1GRtPEdFjsmBCHUmXg-VQM0YmudQTWZ6X2t6lBgTpPxrDRlbAFTH32Rv004iQYzGtW15wVUVXGx_zdePkngkwsf-iFgw5b74AgouTqfME6eb4nzaDb2_CKvWVtBtchiEwDGvrXzhCyEWV7c_p8pbG1-XZg8kGOwcVDgt8ruBxkTh0F2SEnH3ToT-p-0jtnk9K4lvdyjmzfE4zy9VDQgOFN4bIv3imM15BZo1tW_zZynqM5YiRRlg7hpxrBZFv9gCQ5sAMYOsPOofb4eEx2gYR_Qw9LsMuTl1zHBGHuiA5Wb4hatw7A'
            }
        });
        return next.handle(request);
    }
}
