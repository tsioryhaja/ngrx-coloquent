import { HttpClientPromise, HttpClientResponse } from "@herlinus/coloquent";
import { Thenable } from "@herlinus/coloquent/dist/httpclient/Types";
import { AngularHttpClientResponse } from "./response";

export class AngularHttpClientPromise implements HttpClientPromise {
    constructor(private requestPromise: Promise<any>) {
    }

    then<U>(onFulfilled?: (value: HttpClientResponse) => (Thenable<U>|U), onRejected?: (error: any) => (Thenable<U>|U)): Promise<any>;
    then<U>(onFulfilled?: (value: HttpClientResponse) => (Thenable<U>|U), onRejected?: (error: any) => void): Promise<U> {
        const wrappedOnFulfilled = onFulfilled !== undefined
            ?
            (axiosResponse => onFulfilled(new AngularHttpClientResponse(axiosResponse)))
            :
            undefined;
        return <Promise<U>> this.requestPromise.then(
            wrappedOnFulfilled,
            (error) => {
                error;
                throw error;
            }
        );
    }

    catch<U>(onRejected?: (error: any) => (Thenable<U>|U)): Promise<U> {
        return <Promise<U>> this.requestPromise.catch(
            (error) => {
                throw error;
            }
        );
    }
}