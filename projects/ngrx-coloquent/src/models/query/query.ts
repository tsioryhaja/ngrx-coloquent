import { Query } from "@herlinus/coloquent/dist/Query";
import { QueryParam } from "@herlinus/coloquent/dist/QueryParam";

export class AngularQuery extends Query {
    customUrl: string;
    public toString(): string
    {
        let relationToFind = '';

        if (!this.jsonApiId) {
            relationToFind = this.queriedRelationName
                ? '/' + this.queriedRelationName
                : '';
        } else {
            relationToFind = this.queriedRelationName
                ? '/' + this.jsonApiId + '/' + this.queriedRelationName
                : '';
        }

        let idToFind: string = this.idToFind
            ? '/' + this.idToFind
            : '';

        let searchParams: QueryParam[] = [];
        this.addFilterParameters(searchParams);
        this.addIncludeParameters(searchParams);
        this.addOptionsParameters(searchParams);
        this.addPaginationParameters(searchParams);
        this.addSortParameters(searchParams);
        let paramString = '';
        for (let searchParam of searchParams) {
            if (paramString === '') {
                paramString += '?';
            } else {
                paramString += '&';
            }
            paramString += encodeURIComponent(searchParam.name) + '=' + encodeURIComponent(searchParam.value);
        }

        const urlBase = this.customUrl ? this.customUrl.replace('{id}', '' + this.idToFind) : this.jsonApiType + relationToFind + idToFind ;

        return urlBase + paramString;
    }
}