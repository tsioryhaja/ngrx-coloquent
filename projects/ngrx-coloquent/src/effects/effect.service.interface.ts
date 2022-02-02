import { Model } from "@herlinus/coloquent";
import { Observable } from "rxjs";

export interface BaseGlobalEffectService {
    loadOne(BaseModel: typeof Model, queryId: number | string, included?: string[]): Observable<any>;

    loadMany(query: any, page: any): Observable<any>;

    findOne(query: any, id: any): Observable<any>;

    saveOne (data: Model): Observable<any>;

    loadRelation(data: Model, relationName: string): Observable<any>;

    deleteOne(data: Model): Observable<any>;
}

export interface ServicesInterface {
    [name:string]: BaseGlobalEffectService;
}