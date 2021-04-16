import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject } from "@angular/core";
import { HttpClient as ColoquentHttpClient, HttpClientPromise } from "@herlinus/coloquent";
import { AngularHttpClientPromise } from "./promises";

export class AngularHttpClient implements ColoquentHttpClient {
    public get ngrxColoquentHttpClient() {
        return this._httpClient;
    }
    private _httpClient: HttpClient;
    private baseUrl: string;
    private get httpClient(): HttpClient {
        this._httpClient = this._httpClient ? this._httpClient : null;
        return this._httpClient;
    }

    constructor(httpClient?: HttpClient) {
        if(httpClient) this._httpClient = httpClient;
    }

    private updateHttpConfig(config: any) {
        config = config ? config : {};
        config = {
            ...config,
            headers: {
                Accept: 'application/vndi.api+json',
                'Content-type': 'application/vnd.api+json'
            },
            observe: 'response'
        };
        return config;
    }

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setWithCredentials(setWithCredentials: boolean): void {}

    buildUrl(url): string {
        return this.baseUrl + '/' + url;
    }

    get(url: string, config?: any): HttpClientPromise {
        config = this.updateHttpConfig(config);
        return new AngularHttpClientPromise(
            this.httpClient.get(
                this.buildUrl(url),
                config
            ).toPromise()
        );
    }

    delete(url: string, config?: any): HttpClientPromise {
        config = this.updateHttpConfig(config);
        return new AngularHttpClientPromise(
            this.httpClient.delete(
                this.buildUrl(url),
                config
            ).toPromise()
        );
    }

    head(url: string, config?: any): HttpClientPromise {
        config = this.updateHttpConfig(config);
        return new AngularHttpClientPromise(
            this.httpClient.post(
                this.buildUrl(url),
                config
            ).toPromise()
        );
    }

    post(url: string, data?: any, config?: any): HttpClientPromise {
        config = this.updateHttpConfig(config);
        return new AngularHttpClientPromise(
            this.httpClient.post(
                this.buildUrl(url),
                data,
                config
            ).toPromise()
        );
    }

    put(url: string, data?: any, config?: any): HttpClientPromise {
        config = this.updateHttpConfig(config);
        return new AngularHttpClientPromise(
            this.httpClient.put(
                this.buildUrl(url),
                data,
                config
            ).toPromise()
        );
    }

    patch(url: string, data?: any, config?: any): HttpClientPromise {
        config = this.updateHttpConfig(config);
        return new AngularHttpClientPromise(
            this.httpClient.patch(
                this.buildUrl(url),
                data,
                config
            ).toPromise()
        );
    }

    public getImplementingClient(): HttpClient {
        return this.httpClient;
    }
}
