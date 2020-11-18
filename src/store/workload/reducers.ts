import {Reducer} from 'redux';
import {arraySearch, objectSearch, getWeekIndex} from 'utils';
import {WorkLoadActions, WorkLoadActionTypes} from './actions';
import {IGetTableData, ILinks, IMeta} from './interfaces';
import {ViewTypes, ViewTypesOrder, ViewTypeArray} from './enums';
import {content} from './mocks';
import { IRowHeader, IColumn } from 'components/workloadtable/interfaces';
import { Entities } from 'components/workloadtable/enums';

export interface IWorkLoadState {
  data: IGetTableData;
  meta: IMeta | null;
  links: ILinks | null;
  isFetching: boolean;
  year: number;
}

const initialTimeReportState: IWorkLoadState = {
  data: {
    title: 'Workload report',
    view_type: ViewTypes.UPT,
    content
  },
  meta: null,
  links: null,
  isFetching: false,
  year: new Date().getFullYear(),
};

export const workLoadReducer: Reducer<IWorkLoadState, WorkLoadActions> = (
  state = initialTimeReportState,
  action
) => {
  switch (action.type) {
    case WorkLoadActionTypes.GET_WORKLOAD_DATA: {
      return {
        ...state,
        data: action.data
      };
    }
    case WorkLoadActionTypes.FETCH_WORKLOAD: {
      return {
        ...state,
        isFetching: action.isFetching
      }
    }
    case WorkLoadActionTypes.REMOVE_ENTITY:
    case WorkLoadActionTypes.ADD_ENTITY: {
      const stateClone: IWorkLoadState = JSON.parse(JSON.stringify(state));
      const table = stateClone.data.content;

      const { ids, entity, payload } = action.data;

      // console.log(ids, state, payload);

      const header = arraySearch({
        array: table.headers,
        payload: ids,
        view: ViewTypesOrder[ViewTypes.UPT],
      });
      if (header) {
        switch (action.type) {
          case WorkLoadActionTypes.ADD_ENTITY:
            if (payload) header.items = payload.headers;
            break;
          case WorkLoadActionTypes.REMOVE_ENTITY:
          default:
            delete header.items;
            break;
        }
      }

      Object.keys(table.columns).forEach((week: string) => {
        const column = table.columns[week];
        // console.warn(week);
        const cell = objectSearch({
          object: column,
          payload: ids,
          view: ViewTypesOrder[ViewTypes.UPT],
        });
        if (cell) {
          switch (action.type) {
            case WorkLoadActionTypes.ADD_ENTITY:
              if (payload) cell.items = payload.columns[week];
              break;
            case WorkLoadActionTypes.REMOVE_ENTITY:
            default:
              delete cell.items;
              break;
          }
        }
      });

      return { ...stateClone };
    }
    case WorkLoadActionTypes.ADD_WEEKS:
      const stateClone: IWorkLoadState = JSON.parse(JSON.stringify(state));
      const columns = stateClone.data.content.columns;
      const headers = stateClone.data.content.headers;
      const newHeaders = action.data.headers;
      deepMerge(headers, newHeaders);
      stateClone.data.content.columns = { ...columns, ...action.data.columns };
      // stateClone.data.content.headers = headers;  
      return { ...stateClone };      
    default:
      return state;
  }
};

function deepMerge(target: IRowHeader[], source: IRowHeader[], level = 0) {
  const ViewType = ViewTypesOrder[ViewTypes.UPT][level];

  source.forEach(src => {    
    const targetMatch = target.find(tar => tar.key === src.key);
    const isBottomLvl = ViewType === Entities.TASK
    if (isBottomLvl) {
      if (source.length > target.length) {
        target.push(src);
      }
    } else if (targetMatch) {
      if (targetMatch.items && targetMatch.items.length) {
        const newTarget = targetMatch.items;
        const newSource = src.items || [];
        if (newTarget && newTarget.length) {
          deepMerge(newTarget, newSource, level + 1);
        }
      }
    } else if (!isBottomLvl) {
      target.push(src);     
    }
  });
}