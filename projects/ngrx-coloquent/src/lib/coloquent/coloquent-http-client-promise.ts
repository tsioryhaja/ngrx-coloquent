import { HttpClientPromise, HttpClientResponse } from '@herlinus/coloquent';
import { Observable } from 'rxjs';

export class ColoquentHttpClientPromise implements HttpClientPromise {
    private observablePromise: Promise<any>;
    then<U>(onFulfilled?: (value: HttpClientResponse) => U, onRejected?: (error: any) => U): Promise<U>;
    then<U>(onFulfilled?: (value: HttpClientResponse) => U, onRejected?: (error: any) => void): Promise<U> {
        const wrappedOnFulfilled = onFulfilled !== undefined ? (response => onFulfilled(response)): undefined;
        return this.observablePromise.then(wrappedOnFulfilled);
    }
    catch<U>(onRejected?: (error: any) => (U)): Promise<U> {
        return <Promise<U>> this.observablePromise.catch(onRejected);
    }
}