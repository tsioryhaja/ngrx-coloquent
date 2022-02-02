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

import { BodySetBinarySoundIdBinaryPost } from '../models/body-set-binary-sound-id-binary-post';
import { CollectionDocumentSound } from '../models/collection-document-sound';
import { ObjectReadDocumentSound } from '../models/object-read-document-sound';
import { ObjectWriteDocumentSound } from '../models/object-write-document-sound';

@Injectable({
  providedIn: 'root',
})
export class SoundService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation fetchCollectionSoundGet
   */
  static readonly FetchCollectionSoundGetPath = '/sound/';

  /**
   * Fetch Collection.
   *
   * Fetch collection
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fetchCollectionSoundGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchCollectionSoundGet$Response(params?: {
    filter?: Array<string>;
    sort?: string;
    size?: number;
    number?: number;
  }): Observable<StrictHttpResponse<CollectionDocumentSound>> {

    const rb = new RequestBuilder(this.rootUrl, SoundService.FetchCollectionSoundGetPath, 'get');
    if (params) {
      rb.query('filter', params.filter, {});
      rb.query('sort', params.sort, {});
      rb.query('size', params.size, {});
      rb.query('number', params.number, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CollectionDocumentSound>;
      })
    );
  }

  /**
   * Fetch Collection.
   *
   * Fetch collection
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `fetchCollectionSoundGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchCollectionSoundGet(params?: {
    filter?: Array<string>;
    sort?: string;
    size?: number;
    number?: number;
  }): Observable<CollectionDocumentSound> {

    return this.fetchCollectionSoundGet$Response(params).pipe(
      map((r: StrictHttpResponse<CollectionDocumentSound>) => r.body as CollectionDocumentSound)
    );
  }

  /**
   * Path part for operation createObjectSoundPost
   */
  static readonly CreateObjectSoundPostPath = '/sound/';

  /**
   * Create Object.
   *
   * Fetch object
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createObjectSoundPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createObjectSoundPost$Response(params: {
    body: ObjectWriteDocumentSound
  }): Observable<StrictHttpResponse<ObjectReadDocumentSound>> {

    const rb = new RequestBuilder(this.rootUrl, SoundService.CreateObjectSoundPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ObjectReadDocumentSound>;
      })
    );
  }

  /**
   * Create Object.
   *
   * Fetch object
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createObjectSoundPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createObjectSoundPost(params: {
    body: ObjectWriteDocumentSound
  }): Observable<ObjectReadDocumentSound> {

    return this.createObjectSoundPost$Response(params).pipe(
      map((r: StrictHttpResponse<ObjectReadDocumentSound>) => r.body as ObjectReadDocumentSound)
    );
  }

  /**
   * Path part for operation fetchObjectSoundIdGet
   */
  static readonly FetchObjectSoundIdGetPath = '/sound/{id}';

  /**
   * Fetch Object.
   *
   * Fetch object
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `fetchObjectSoundIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchObjectSoundIdGet$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<ObjectReadDocumentSound>> {

    const rb = new RequestBuilder(this.rootUrl, SoundService.FetchObjectSoundIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/vnd.api+json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ObjectReadDocumentSound>;
      })
    );
  }

  /**
   * Fetch Object.
   *
   * Fetch object
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `fetchObjectSoundIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  fetchObjectSoundIdGet(params: {
    id: string;
  }): Observable<ObjectReadDocumentSound> {

    return this.fetchObjectSoundIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<ObjectReadDocumentSound>) => r.body as ObjectReadDocumentSound)
    );
  }

  /**
   * Path part for operation setBinarySoundIdBinaryPost
   */
  static readonly SetBinarySoundIdBinaryPostPath = '/sound/{id}/binary';

  /**
   * Set Binary.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setBinarySoundIdBinaryPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  setBinarySoundIdBinaryPost$Response(params: {
    id: string;
    body: BodySetBinarySoundIdBinaryPost
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, SoundService.SetBinarySoundIdBinaryPostPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'multipart/form-data');
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
   * Set Binary.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setBinarySoundIdBinaryPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  setBinarySoundIdBinaryPost(params: {
    id: string;
    body: BodySetBinarySoundIdBinaryPost
  }): Observable<void> {

    return this.setBinarySoundIdBinaryPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation streamSoundIdStreamGet
   */
  static readonly StreamSoundIdStreamGetPath = '/sound/{id}/stream';

  /**
   * Stream.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `streamSoundIdStreamGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  streamSoundIdStreamGet$Response(params: {
    id: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, SoundService.StreamSoundIdStreamGetPath, 'get');
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
   * Stream.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `streamSoundIdStreamGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  streamSoundIdStreamGet(params: {
    id: string;
  }): Observable<void> {

    return this.streamSoundIdStreamGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
