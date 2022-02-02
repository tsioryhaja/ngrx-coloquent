/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CollectionDocumentNumero } from '../models/collection-document-numero';
import { ObjectReadDocumentNumero } from '../models/object-read-document-numero';
import { ObjectWriteDocumentNumero } from '../models/object-write-document-numero';

@Injectable({
  providedIn: 'root',
})
export class NumeroService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation fetchCollectionNumeroGet
   */
  static readonly FetchCollectionNumeroGetPath = '/numero/';

  /**
   * Fetch Collection.
   *
   * Fetch collection
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fetchCollectionNumeroGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchCollectionNumeroGet$Response(params?: {
    filter?: Array<string>;
    sort?: string;
    'page[size]'?: number;
    'page[number]'?: number;
  }): Observable<StrictHttpResponse<CollectionDocumentNumero>> {

    const rb = new RequestBuilder(this.rootUrl, NumeroService.FetchCollectionNumeroGetPath, 'get');
    if (params) {
      rb.query('filter', params.filter, {});
      rb.query('sort', params.sort, {});
      rb.query('page[size]', params['page[size]'], {});
      rb.query('page[number]', params['page[number]'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CollectionDocumentNumero>;
      })
    );
  }

  /**
   * Fetch Collection.
   *
   * Fetch collection
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `fetchCollectionNumeroGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchCollectionNumeroGet(params?: {
    filter?: Array<string>;
    sort?: string;
    'page[size]'?: number;
    'page[number]'?: number;
  }): Observable<CollectionDocumentNumero> {

    return this.fetchCollectionNumeroGet$Response(params).pipe(
      map((r: StrictHttpResponse<CollectionDocumentNumero>) => r.body as CollectionDocumentNumero)
    );
  }

  /**
   * Path part for operation createObjectNumeroPost
   */
  static readonly CreateObjectNumeroPostPath = '/numero/';

  /**
   * Create Object.
   *
   * Fetch object
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createObjectNumeroPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createObjectNumeroPost$Response(params: {
    body: ObjectWriteDocumentNumero
  }): Observable<StrictHttpResponse<ObjectReadDocumentNumero>> {

    const rb = new RequestBuilder(this.rootUrl, NumeroService.CreateObjectNumeroPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ObjectReadDocumentNumero>;
      })
    );
  }

  /**
   * Create Object.
   *
   * Fetch object
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createObjectNumeroPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createObjectNumeroPost(params: {
    body: ObjectWriteDocumentNumero
  }): Observable<ObjectReadDocumentNumero> {

    return this.createObjectNumeroPost$Response(params).pipe(
      map((r: StrictHttpResponse<ObjectReadDocumentNumero>) => r.body as ObjectReadDocumentNumero)
    );
  }

  /**
   * Path part for operation fetchObjectNumeroIdGet
   */
  static readonly FetchObjectNumeroIdGetPath = '/numero/{id}';

  /**
   * Fetch Object.
   *
   * Fetch object
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fetchObjectNumeroIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchObjectNumeroIdGet$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<ObjectReadDocumentNumero>> {

    const rb = new RequestBuilder(this.rootUrl, NumeroService.FetchObjectNumeroIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ObjectReadDocumentNumero>;
      })
    );
  }

  /**
   * Fetch Object.
   *
   * Fetch object
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `fetchObjectNumeroIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchObjectNumeroIdGet(params: {
    id: string;
  }): Observable<ObjectReadDocumentNumero> {

    return this.fetchObjectNumeroIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<ObjectReadDocumentNumero>) => r.body as ObjectReadDocumentNumero)
    );
  }

  /**
   * Path part for operation deleteObjectNumeroIdDelete
   */
  static readonly DeleteObjectNumeroIdDeletePath = '/numero/{id}';

  /**
   * Delete Object.
   *
   * Delete object
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteObjectNumeroIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteObjectNumeroIdDelete$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, NumeroService.DeleteObjectNumeroIdDeletePath, 'delete');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Delete Object.
   *
   * Delete object
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteObjectNumeroIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteObjectNumeroIdDelete(params: {
    id: string;
  }): Observable<void> {

    return this.deleteObjectNumeroIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation updateObjectNumeroIdPatch
   */
  static readonly UpdateObjectNumeroIdPatchPath = '/numero/{id}';

  /**
   * Update Object.
   *
   * Update object
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateObjectNumeroIdPatch()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateObjectNumeroIdPatch$Response(params: {
    id: string;
    body: ObjectWriteDocumentNumero
  }): Observable<StrictHttpResponse<ObjectReadDocumentNumero>> {

    const rb = new RequestBuilder(this.rootUrl, NumeroService.UpdateObjectNumeroIdPatchPath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ObjectReadDocumentNumero>;
      })
    );
  }

  /**
   * Update Object.
   *
   * Update object
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateObjectNumeroIdPatch$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateObjectNumeroIdPatch(params: {
    id: string;
    body: ObjectWriteDocumentNumero
  }): Observable<ObjectReadDocumentNumero> {

    return this.updateObjectNumeroIdPatch$Response(params).pipe(
      map((r: StrictHttpResponse<ObjectReadDocumentNumero>) => r.body as ObjectReadDocumentNumero)
    );
  }

}
