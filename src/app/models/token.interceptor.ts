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
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEifQ.eyJpc3MiOiAiaHR0cHM6Ly9tb25jb21wdGUtZGV2LmFic3lzLmZyIiwgImlhdCI6IDE2MTg5MTg5OTMsICJleHAiOiAxNjE4OTIyNTkzLCAia2lkIjogIjZZVS1rajd1Y1dFbV9WT3hhaU9Pbnl3S21rYkVwSUxuOVRjOTN3VGtEdFEiLCAianRpIjogIlQtNjAxMjIwNjc3NzUyNGQ2Y2FjZWIxNDJmN2ZkNzdmZWUiLCAiYXVkIjogWyJsc1d5aFNacXU3WDkiLCAiNEpFNWpZSjdDeU5rIiwgIkhndzJPSFhQa01SQSJdLCAic2NvcGUiOiAib3BlbmlkIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHByb2ZpbGUgaHR0cHM6Ly9zYXJhLWRldi5hYnN5cy5mciBodHRwczovL3NlcmEtZGV2LmFic3lzLmZyIiwgInN1YiI6ICJhYmEwZDRlY2Q0YmY2MmI5YmUyZGY4ZTc1NjgxZTE4NDhkMjAxMGE0MTkwOWI1ZGI0NTgwNDI3MmIwNjkyZWIwIiwgImF6cCI6ICJIZ3cyT0hYUGtNUkEifQ.gNTQ49sJLkdTVLbMecY9OXfSqGEcl0t3dAWtoxfkUkNnk-nsOms0k-Zf8m0oZxDqFWcYwR5u1fSD0gjKAY8nzrnuFxc4qtn9NWWbd1peKHPegSECoPKPEguQqdCIbGyBpxaW5OSqz_vDiFtefvmgtgkl4w7s4_B5fe5Ldjx-EgsPyccVNvfwxtD1CAERMkqwZ8IpG9aLPMSDB4CUWi7wmBxYXuSNpyut5q9D9Vf4mSGWgEiEt6tSGngNwXaTT-iA72QRJ_hWXMlISHVUQWtBN14iI0dRG1XXwAh_Zly8sBu2ViY3DsGhwDdDVR5BhiJExjh41s1MLeC3xxd0DnoNFg'
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
