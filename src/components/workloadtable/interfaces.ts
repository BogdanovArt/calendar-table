import {Entities} from './enums';
import {Opened, ViewTypeArray} from 'store/workload/enums';

export interface IWorkLoadTableState {
  scrolling: boolean;
  current: string;
  activeIndex: number;
  active: string;
  cellWidth: number;
  position: number;
  scrollByTable: boolean;
  scrollByWidget: boolean;
  handlePosition: ICoordinates;
  loadedWeeks: ILoadedWeeks;
  opened?: openedData[]
}

export interface openedData {
  id: string;
  items?: openedData[];
}

export interface ICoordinates {
  x: number;
  y: number;
}

export interface ILoadedWeeks {
  start: number;
  end: number;
}

export interface IPosition {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
  node: HTMLElement;
}

export interface ITableColumns {
  [key: string]: IColumn;
}

export interface ITableData {
  headers: IRowHeader[];
  columns: ITableColumns;
}

export interface ITablePageProps extends ITableData {
  fetching: boolean;
}

export interface IWorkLoadTableProps extends ITablePageProps {
  viewType: ViewTypeArray,
  addWeeks: ({ query, start, end } : {query: any, start: string, end: string }) => Promise<void>;
  addEntity: (
    entity: string,
    target: string,
    ids: IEntityOrder,
    view: ViewTypeArray
  ) => void;
  removeEntity: (
    entity: string,
    target: string,
    ids: IEntityOrder,
    view: ViewTypeArray
  ) => void;
  getWorkLoadData: (q: any) => Promise<void>;
}

export interface IHeader {
  title: string;
  index?: number;
  type?: string;
  deficiency?: number | string;
}

export interface IRowHeader {
  key: string;
  entity?: Entities;
  type?: string;
  title?: string;
  expandable?: string;
  items?: Array<IRowHeader>;
  deficiency?: number;
}

export interface IEntityOrder {
  [key: string]: string;
}

export interface IColumn {
  [key: string]: IColumnCell;
}

export interface IColumnCell extends IHeader {
  key?: string;
  index?: number;
  items?: IColumn;
  link?: string;
  time?: string;
  entity?: string;
  id?: string;
  week?: string;
}

export interface IColProject extends IHeader {
  items?: ITask[];
}

export interface ITask extends IHeader {
  id?: string;
  link?: string;
  time?: string;
  week?: string;
  status?: number;
}

export interface IUserHeader extends IHeader {
  items?: IProjects;
}

export interface IProjects {
  [key: string]: IProjectHeader;
}

export interface IProjectHeader extends IHeader {
  expandable?: boolean;
  items?: string[];
}

export interface IRowReference {
  [key: string]: IWeekReference;
}

export interface IWeekReference {
  [key: string]: IUserHeader | IColProject;
  [key: number]: ITask;
}

