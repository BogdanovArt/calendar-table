// Import redux types
import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import axios from 'axios';
import qs from 'querystring';

// Import Character Typing
import {ITimeReportState} from './reducers';
import {IQueryTransformed} from '../report';

// Create Action Constants
export enum TimeReportActionTypes {
  GET_TIME_REPORT_DATA = 'GET_TIME_REPORT_DATA',
  FETCH_TIME_REPORT = 'FETCH_TIME_REPORT',
}

// Interface for Get All Action Type
export interface IGetTimeReportData {
  type: TimeReportActionTypes.GET_TIME_REPORT_DATA;
  data: ITimeReportState;
}

export interface IFetchTimeReport {
  type: TimeReportActionTypes.FETCH_TIME_REPORT;
  isFetching: boolean;
}

/*
Combine the action types with a union (we assume there are more)
example: export type CharacterActions = IGetAllAction | IGetOneAction ...
*/
export type TimeReportActions = IGetTimeReportData | IFetchTimeReport;

/* Get All Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const getTimeReportData: ActionCreator<ThunkAction<Promise<any>, ITimeReportState, null, IGetTimeReportData>> = (query: IQueryTransformed) => {
  return async (dispatch: Dispatch) => {
    const q = qs.stringify(query);
    try {
      dispatch({type: TimeReportActionTypes.FETCH_TIME_REPORT, isFetching: true});
      const response = await axios.get(`/api/v1/users${q ? '?' + q : ''}`);
      dispatch({data: response.data, type: TimeReportActionTypes.GET_TIME_REPORT_DATA});
      dispatch({type: TimeReportActionTypes.FETCH_TIME_REPORT, isFetching: false});
    } catch (err) {
      dispatch({type: TimeReportActionTypes.FETCH_TIME_REPORT, isFetching: false});
      console.error(err);
    }
  };
};
