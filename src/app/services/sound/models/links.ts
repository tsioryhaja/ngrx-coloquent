/* tslint:disable */
/* eslint-disable */
import { LinkObject } from './link-object';

/**
 * JSON:API Links Object
 */
export interface Links {
  first?: (LinkObject | string);
  last?: (LinkObject | string);
  next?: (LinkObject | string);
  prev?: (LinkObject | string);
  related?: (LinkObject | string);
  self?: (LinkObject | string);
}
