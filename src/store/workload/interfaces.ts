import {ITableData, ITask} from 'components/workloadtable/interfaces';
import {ViewTypes} from './enums';

export interface IGetTableData {
  title: string;
  view_type: ViewTypes;
  content: ITableData;
}


export interface IGetProjectData {
  [key: string]: ITask[];
}

export interface IMeta {
  pagination?: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: string[];
  };
}

export interface ILinks {

}

export interface IGetProjectParams {
  week: string;
  user: string;
  project: string;
}
