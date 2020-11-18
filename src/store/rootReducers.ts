import {combineReducers} from 'redux';

import {ITodoState, todoReducer} from './main/reducers';
import {IReportState, reportReducer} from './report';
import {ITimeReportState, timeReportReducer} from './timeReport';
import {IWorkLoadState, workLoadReducer} from './workload';

export interface IAppState {
  todoState: ITodoState;
  reportState: IReportState;
  timeReportState: ITimeReportState;
  workLoadState: IWorkLoadState;
}

export const rootReducer = combineReducers<IAppState>({
  todoState: todoReducer,
  reportState: reportReducer,
  timeReportState: timeReportReducer,
  workLoadState: workLoadReducer,
});

