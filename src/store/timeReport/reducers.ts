// Import Reducer type
import {Reducer} from 'redux';
import {IData, ILinks, IMeta} from '../report';
import {TimeReportActions, TimeReportActionTypes,} from './actions';

// Define the Character State
export interface ITimeReportState {
  data: IData | null;
  meta: IMeta | null;
  links: ILinks | null;
  isFetching: boolean;
}

// Define the initial state
const initialTimeReportState: ITimeReportState = {
  data: null,
  meta: null,
  links: null,
  isFetching: false,
};

export const timeReportReducer: Reducer<ITimeReportState, TimeReportActions> = (
  state = initialTimeReportState,
  action
) => {
  switch (action.type) {
    case TimeReportActionTypes.GET_TIME_REPORT_DATA: {
      return {
        ...state,
        ...action.data,
      };
    }
    case TimeReportActionTypes.FETCH_TIME_REPORT: {
      return {
        ...state,
        isFetching: action.isFetching
      }
    }
    default:
      return state;
  }
};
