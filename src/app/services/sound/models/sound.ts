/* tslint:disable */
/* eslint-disable */
import { Links } from './links';
import { SoundAttributes } from './sound-attributes';

/**
 * JSON:API Resource Object
 */
export interface Sound {
  attributes?: SoundAttributes;
  id?: string;
  links?: Links;
  type?: string;
}
