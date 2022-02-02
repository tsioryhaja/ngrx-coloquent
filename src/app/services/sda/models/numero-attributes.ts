/* tslint:disable */
/* eslint-disable */
import { NumeroState } from './numero-state';
import { NumeroType } from './numero-type';
export interface NumeroAttributes {
  area_code?: number;
  company_id?: number;
  creation_date?: string;
  distribution?: boolean;
  domiciliation?: boolean;
  domiciliation_date?: string;
  folder_id?: number;
  old_folder_id?: number;
  old_state?: NumeroState;
  phone_number?: string;
  provider_id?: number;
  state?: NumeroState;
  state_change_date?: string;
  type?: NumeroType;
}
