// Import Reducer type
import {Reducer} from 'redux';
import {IData, ILinks, IMeta} from './interfaces';
import {ReportActions, ReportActionTypes,} from './actions';

// Define the Character State
export interface IReportState {
  data: IData | null;
  meta: IMeta | null;
  links: ILinks | null;
  isFetching: boolean;
}

// Define the initial state
const initialReportState: IReportState = {
  data: null,
  meta: null,
  links: null,
  isFetching: false,
};

export const reportReducer: Reducer<IReportState, ReportActions> = (
  state = initialReportState,
  action
) => {
  switch (action.type) {
    case ReportActionTypes.GET_REPORT_DATA: {
      return {
        ...state,
        ...action.data,
      };
    }
    case ReportActionTypes.FETCH_REPORT: {
      return {
        ...state,
        isFetching: action.isFetching
      }
    }
    default:
      return state;
  }
};
