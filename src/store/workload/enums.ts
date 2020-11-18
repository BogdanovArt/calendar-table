import {Entities} from 'components/workloadtable/enums';

export enum ViewTypes {
  UPT = 'user-project-task',
  PUT = 'project-user-task',
  PT = 'project-task',
  UT = 'user-task',
}

export type Opened = {
  [Entities.USER]?: number;
  [Entities.PROJECT]?: number;
}

export type ViewTypeArray = Array<Entities.USER | Entities.PROJECT | Entities.TASK>

export const ViewTypesOrder = {
  [ViewTypes.UPT]: [Entities.USER, Entities.PROJECT, Entities.TASK],
  [ViewTypes.PUT]: [Entities.PROJECT, Entities.USER, Entities.TASK],
}
