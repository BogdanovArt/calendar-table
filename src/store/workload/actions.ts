import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import axios from 'axios';
import qs from 'qs';

import {IEntityOrder, ITableColumns, ITableData} from 'components/workloadtable/interfaces';
import {Entities, API} from 'components/workloadtable/enums';
import {getQuery, getWeekIndex} from 'utils';

import {ViewTypeArray} from './enums';
import {IGetTableData} from './interfaces';

export enum WorkLoadActionTypes {
  GET_WORKLOAD_DATA = 'GET_WORKLOAD_DATA',
  REMOVE_ENTITY = 'REMOVE_ENTITY',
  ADD_ENTITY = 'ADD_ENTITY',
  ADD_WEEKS = 'ADD_WEEKS',
  FETCH_WORKLOAD = 'FETCH_WORKLOAD',
}

export interface IEndpoints {
  [key: string]: string,
}

export interface IGetWorkLoadData {
  type: WorkLoadActionTypes.GET_WORKLOAD_DATA;
  data: IGetTableData;
}

export interface IFetchWorkLoad {
  type: WorkLoadActionTypes.FETCH_WORKLOAD;
  isFetching: boolean;
}

export interface IEntityMutation {
  type: WorkLoadActionTypes.ADD_ENTITY | WorkLoadActionTypes.REMOVE_ENTITY;
  data: {
    target: string;
    entity: Entities;
    ids: IEntityOrder;
    payload?: ITableData;
  };
  user: string;
  project: string;
}

export interface IWeeksMutation {
  type: WorkLoadActionTypes.ADD_WEEKS;
  data: ITableData;
  isFetching: boolean;
}

export type WorkLoadActions = IGetWorkLoadData | IFetchWorkLoad | IEntityMutation | IWeeksMutation;

export const getWorkLoadData: ActionCreator<ThunkAction<Promise<void>, null, null, IGetWorkLoadData>> = (query: any) => {
  return async (dispatch: Dispatch): Promise<void> => {
    const q = qs.stringify(query);

    const url = API.index + (q ? '?' + q : '');

    try {
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: true});
      const res = await axios({
        method: 'GET',
        url
      });
      const table = res.data.data;
      const columns = table.content.columns;  
      
      Object.keys(columns).forEach(week => {
        columns[week].heading.index = getWeekIndex(week);
      });
      // const response = await axios.get(`/api/v1/workload${q ? '?' + q : ''}`);
      dispatch({data: table, type: WorkLoadActionTypes.GET_WORKLOAD_DATA});
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: false});
    } catch (err) {
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: false});
      console.error(err);
    }
  };
};

export const removeEntity: ActionCreator<ThunkAction<Promise<void>, null, null, IEntityMutation>> = (
  entity: string,
  target: string,
  ids: IEntityOrder,
  view: ViewTypeArray,
) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ data: { entity, target, ids, }, type: WorkLoadActionTypes.REMOVE_ENTITY});
    } catch (err) {
      console.error(err);
    }
  };
};

export const addEntity: ActionCreator<ThunkAction<Promise<void>, null, null, IEntityMutation>> = (
  entity: string,
  target: string,
  ids: IEntityOrder,
  view: ViewTypeArray,
) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const q = getQuery();
      delete q.opened;
      delete q.active;
      view.forEach(type => {
        if (ids[type]) q[type] = ids[type];
      });
      q.target = target;
      const query = qs.stringify(q);
      const url = API[target] + (query ? '?' + query : '');
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: true});
      // const data = target === Entities.PROJECT ? projects : tasks; // @TODO remove tmp logic
      const res = await axios({
        method: 'GET',
        url
      });
      dispatch({data: { entity, target, ids, payload: res.data.data}, type: WorkLoadActionTypes.ADD_ENTITY });
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: false});
    } catch (err) {
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: false});
      console.error(err);
    }
  };
};

export const addWeeks: ActionCreator<ThunkAction<Promise<void>, null, null, IWeeksMutation>> = (query: any
) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: true});
      const q = qs.stringify(query);
      const url = API.index + (q ? '?' + q : '');
      const res = await axios({
        method: 'GET',
        url
      });
      const headers = res.data.data.content.headers;
      const columns = res.data.data.content.columns;      
      
      if (columns) {
        Object.keys(columns).forEach(week => {
          columns[week].heading.index = getWeekIndex(week);
        });
        dispatch({ data: { headers, columns }, type: WorkLoadActionTypes.ADD_WEEKS });
      }
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: false});
    } catch (err) {
      dispatch({type: WorkLoadActionTypes.FETCH_WORKLOAD, isFetching: false});
      console.error(err);
    }
  };
};
