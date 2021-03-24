import { HttpClient } from "@herlinus/coloquent";

@Injectable()
export class ColoquentHttpService implements HttpClient {
    protected baseUrl: string;
    protected withCredential: boolean;

    constructor(protected httpClient?: HttpClient) {}
    getHttpClient() {
        return this.httpClient;
    }

    setHttpClient(value: HttpClient) {
        this.httpClient = value;
    }

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setWithCredentials(withCredentials: boolean) {
        this.withCredential = withCredentials;
    }

    get(url: string, config?: any): http
}