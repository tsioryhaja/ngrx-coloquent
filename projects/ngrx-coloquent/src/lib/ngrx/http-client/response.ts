import { HttpResponse } from "@angular/common/http";
import { HttpClientResponse } from "@herlinus/coloquent";

export class AngularHttpClientResponse implements HttpClientResponse {
    constructor(private httpResponse: HttpResponse<any>) {}

    getData(): any {
        return this.httpResponse.body;
    }

    getUnderlying(): any {
        return this.httpResponse;
    }
}
