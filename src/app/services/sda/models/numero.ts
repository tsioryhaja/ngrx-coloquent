/* tslint:disable */
/* eslint-disable */
import { Links } from './links';
import { NumeroAttributes } from './numero-attributes';

/**
 * JSON:API Resource Object
 */
export interface Numero {
  attributes?: NumeroAttributes;
  id?: string;
  links?: Links;
  type?: string;
}
