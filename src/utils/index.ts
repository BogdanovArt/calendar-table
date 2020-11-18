// import qs, {ParsedUrlQuery} from 'querystring';
import qs from 'qs';

import {IQuery, IQueryTransformed, ITableHeaders} from 'store/report';
import {
  IColumn,
  IColumnCell,
  IEntityOrder,
  IRowHeader,
  IRowReference,
  openedData,
} from 'components/workloadtable/interfaces';
import {Entities} from 'components/workloadtable/enums';
import {ViewTypeArray} from 'store/workload/enums';

export const dateToString = (date?: Date | null, separator = '-', reverse?: boolean): string => {
  if (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return reverse
      ? year + separator + month + separator + day
      : day + separator + month + separator + year;
  }
  return '';
}

export enum q {
  date_end = 'date-end',
  date_start = 'date-start',
  per_page = 'per-page',
  active = 'active',
  page = 'page',
  opened = 'opened'
}

export const queryTransformer = (query: IQuery): IQueryTransformed => {
  const QUERIES = Object.assign({}, query) as any;
  const transformed = {} as IQueryTransformed;
  if (QUERIES.sort) {
    const {sort} = QUERIES;
    delete QUERIES.sort;
    transformed[sort.key] = sort.order;
  }
  if (QUERIES.period) {
    const {period} = QUERIES;
    delete QUERIES.period;
    transformed[q.date_start] = period.start;
    transformed[q.date_end] = period.end;
  }
  const KEYS: string[] = Object.keys(QUERIES);
  if (KEYS.length) {
    KEYS.forEach((el: string) => {
      transformed[el] = QUERIES[el];
    });
  }
  return transformed;
}
function some({
  columns,
  lastLevel
}: {
  columns: { [key: string]: IColumn },
  lastLevel: number
}){

}

export function getFlatColumns({
  columns,
  lastLevel
}: {
  columns: { [key: string]: IColumn };
  lastLevel: number;
}): IRowReference {
  Object.keys(columns).forEach((key: string) => {    // week level
    columns[key] = flatter({ data: columns[key], level: 0, lastLevel });
  });
  return columns as IRowReference;
}

function flatter({
  data,
  level = 0,
  lastLevel,
  parentID,
} : {
  data: IColumn;
  level: number;
  parentID?: string;
  lastLevel: number;
}): IColumn {
  // @TODO - переписать назначение идентификаторов
  let ref: IColumn = {};
  let index = 0;
  Object.keys(data).forEach((key: string) => {
    const object = data[key]; 
    object.id = key;
    const keyRef = level === lastLevel
      ? index
      : key;
    index++;
    const id: string = parentID ? `${parentID}-${keyRef}` : `${keyRef.toString()}`;

    ref[id] = object;
    if (object.items) {
      ref = {...ref, ...flatter({ 
        data: object.items,
        level: level + 1,
        parentID: id,
        lastLevel
      })};
      delete object.items;
    }
  });
  return ref as IColumn;
}

export function arraySearch({ 
  array,
  payload,
  view,
  level = 0 
}: {
  array: IRowHeader[];
  payload: IEntityOrder;
  view: Entities[];
  level?: number;
}): IRowHeader | undefined
{
  const currentEntityId = payload[view[level]];
  const subEntityId = payload[view[level + 1]];
  let match;
  for (const item of array) {
    if (item.key == currentEntityId) {
      if (subEntityId !== undefined && item.items && item.items.length) {
        match = arraySearch({
          array: item.items,
          payload,
          view,
          level: level + 1
        });
      } else {
        match = item;
        break;
      }
    }
  }
  return match;
}

export function objectSearch({
  object,
  payload,
  view,
  level = 0 
}:{
  object: IColumn;
  payload: IEntityOrder;
  view: Entities[];
  level?: number;
}): IColumnCell | undefined {

  const currentEntityId = payload[view[level]];
  const subEntityId = payload[view[level + 1]];
  let match;
  for (const key of Object.keys(object)) {
    const item = object[key];
    if (key == currentEntityId.toString()) {
      if (subEntityId !== undefined && item.items) {
        match = objectSearch({
          object: item.items,
          payload,
          view,
          level: level + 1
        });
      } else {
        match = item;
        break;
      }
    }
  }
  return match;
}

export function querySet(name: string, value: any): void {
  try{
    const {origin, search, pathname} = document.location;
    const query = qs.parse(search.substr(1));
    if (!value) {
      delete query[name]
    } else {
      query[name] = value
    }
    const str = qs.stringify(query);
    window.history.replaceState('', '', origin + pathname + (str ? `?${str}` : ''));
  } catch(err) {
    console.warn(err);
  }
}

export function queryGet(name: string): any {
  const query = qs.parse(document.location.search.substr(1));
  return query[name];
}

export function getQuery(): any {
  return qs.parse(document.location.search.substr(1));
}

export function formatDate(date: Date): string {
  
    
  const chunks = [
    date.getFullYear(),
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2)
  ];  
  return chunks.join('-');
}

export function getOpened(
{
  opened,
  parentEntity,
  viewType,
  data,
  level = 0,
}: {
  parentEntity?: openedData;
  opened: openedData[];
  viewType: ViewTypeArray;
  data: IEntityOrder;
  level?: number;
}): void {
  const entityId = data[viewType[level]];
  const subEntityId = data[viewType[level + 1]];
  const match = opened.findIndex(el => el.id === entityId.toString());
  if (match !== -1) {
    const el = opened[match];
    if (subEntityId !== undefined) {
      if (!el.items) el.items = [];
      getOpened({
        opened: el.items,
        parentEntity: el,
        viewType,
        data,
        level: level + 1,
      })
    } else {
      opened.splice(match, 1);
      if (!opened.length && parentEntity) {
        delete parentEntity.items;
      } 
    }
  } else {
    if (opened) {      
      opened.push({ id: entityId.toString() });
    } else {
      opened = [{ id: entityId.toString() }];
    }
  }
 
}

export function checkTimestamp(str: string) {
  if (str && str.length < 13) {
    const diff = 13 - str.length;
    str += '0'.repeat(diff);
  }
  return str;
}

export function weeksInYear(year = new Date().getFullYear()) {
  const d = new Date(year, 0, 1);
  const isLeap = new Date(year, 1, 29).getMonth() === 1;
  return d.getDay() === 4 || isLeap && d.getDay() === 3 ? 53 : 52
}

export const getWeekIndex = (week: string, year?: number): number => {
  const d: Date = new Date(parseInt(week, 10));
  const firstDayOfYear: Date = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
  let index = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  const dateY = d.getFullYear();
  const currY = year || new Date().getFullYear();
  if (dateY < currY) {
    index = 1
  } else if (dateY > currY) {
    index = weeksInYear();
  }
  return index;
}