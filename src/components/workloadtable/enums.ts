import { IEndpoints } from "store/workload";

export enum CellTypes {
  sort = 'type_sort',
  user = 'type_user',
  task = 'type_task',
}

export enum Entities {
  TASK = 'task',
  USER = 'user',
  PROJECT = 'project',
}

export enum RowActions {
  ADD = 'add',
  REMOVE = 'remove',
}
export const API_ROOT = '/api/v1/users/workload';
export const API: IEndpoints = {
  index: API_ROOT + '',
  task: API_ROOT + '/tasks',
  project: API_ROOT + '/projects',
  weeks:API_ROOT + '/weeks'
}
