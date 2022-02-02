/* tslint:disable */
/* eslint-disable */
import { Jsonapi } from './jsonapi';
import { Links } from './links';
import { Numero } from './numero';
export interface CollectionDocumentNumero {
  data: Array<Numero>;
  included?: string;
  jsonapi?: Jsonapi;
  links?: Links;
  meta?: {
};
}
