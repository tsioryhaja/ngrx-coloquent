import { HttpClientResponse } from "@herlinus/coloquent";

export class AngularHttpClientResponse implements HttpClientResponse {
    constructor(private httpResponse: any) {}

    getData(): any {
        return this.httpResponse;
    }

    getUnderlying(): any {
        return this.httpResponse;
    }
}