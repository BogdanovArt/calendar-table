// Import redux types
import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import axios from 'axios';
import qs from 'querystring';

// Import Character Typing
import {IReportState} from './reducers';
import {IQueryTransformed} from './interfaces';

// Create Action Constants
export enum ReportActionTypes {
  GET_REPORT_DATA = 'GET_REPORT_DATA',
  FETCH_REPORT = 'FETCH_REPORT',
}

// Interface for Get All Action Type
export interface IGetReportData {
  type: ReportActionTypes.GET_REPORT_DATA;
  data: IReportState;
}

export interface IFetchReport {
  type: ReportActionTypes.FETCH_REPORT;
  isFetching: boolean;
}

/*
Combine the action types with a union (we assume there are more)
example: export type CharacterActions = IGetAllAction | IGetOneAction ...
*/
export type ReportActions = IGetReportData | IFetchReport;

/* Get All Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const getReportData: ActionCreator<ThunkAction<Promise<any>, IReportState, null, IGetReportData>> = (query: IQueryTransformed) => {
  return async (dispatch: Dispatch) => {
    const q = qs.stringify(query);
    try {
      dispatch({type: ReportActionTypes.FETCH_REPORT, isFetching: true})
      const response = await axios.get(`/api/v1${q ? '?' + q : ''}`);
      dispatch({data: response.data, type: ReportActionTypes.GET_REPORT_DATA});
      dispatch({type: ReportActionTypes.FETCH_REPORT, isFetching: false})
    } catch (err) {
      dispatch({type: ReportActionTypes.FETCH_REPORT, isFetching: false})
      console.error(err);
    }
  };
};
