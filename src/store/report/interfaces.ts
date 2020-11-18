import {GLOBAL} from '../../globals/enums';

export interface IPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links?: ILinks;
}

export interface IQuery {
  page?: number;
  date_start?: string;
  date_end?: string;
  sort?: ISort;
  period?: IPeriod;
}

export interface IQueryTransformed {
  [key: string]: string | number | undefined | null;
}

export interface ISort {
  key: string;
  order: IOrder;
}

export interface IPeriod {
  start: string;
  end?: string;
}

export type IOrder = GLOBAL | null;

export type queryValue = string | number | ISort | IPeriod | null;

export interface IMeta {
  pagination?: IPagination;
}

export interface ILinks {
  [key: string]: string;
}

export interface IData {
  title: string;
  content: ITable[];
}

export interface ITable {
  type: string;
  headers: ITableHeaders[];
  data: ITableRows[];
}

export enum ELinkTypes {
  TYPE_LINK = 'type_link',
  TYPE_COMP = 'type_compare',
  TYPE_STRING = 'type_string',
  TYPE_MULTIPLE = 'type_multiple',
}

export interface ITableHeaders {
  key: string;
  type: string;
  order: string;
  title: string;
}

export type TTableCell = IRowLinkType | string | IRowCompType;

export interface ITableRows {
  [key: string]: TTableCell;
}

export interface IRowLinkType {
  title: string;
  link: string;
}

export interface IRowStringType {
  [key: string]: string;
}

export interface IRowCompType {
  value1: string;
  [key: string]: string;
}
