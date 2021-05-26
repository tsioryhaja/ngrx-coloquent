import { HttpClientResponse } from "@herlinus/coloquent";

export class ColoquentHttpCLientResponse implements HttpClientResponse {
    constructor(private response: any) {
    }

    getData(): any {
        return this.response;
    }

    getUnderlying(): any {
        return this.response;
    }
}