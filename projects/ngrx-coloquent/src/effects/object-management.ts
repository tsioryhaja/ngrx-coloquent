import { PluralResponse } from "@herlinus/coloquent";
import { AngularHttpClientResponse, Model } from "../public-api";

export function createObjects(builder: any, response: any) {
    const httpClientResponse = new AngularHttpClientResponse(response);
    const resp = new PluralResponse(builder.getQuery(), httpClientResponse, builder.getModelType(), response);
    return resp.getData();
}

export function findFromState(state: any, id: any[]) {

}