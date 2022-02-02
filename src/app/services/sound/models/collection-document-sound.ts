/* tslint:disable */
/* eslint-disable */
import { Jsonapi } from './jsonapi';
import { Links } from './links';
import { Sound } from './sound';
export interface CollectionDocumentSound {
  data: Array<Sound>;
  included?: string;
  jsonapi?: Jsonapi;
  links?: Links;
  meta?: {
};
}
