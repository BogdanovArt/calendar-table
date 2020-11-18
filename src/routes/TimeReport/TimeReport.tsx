import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';

import {routes} from 'routes';
import {IAppState} from 'store/rootReducers';
import {getTimeReportData, ITimeReportState} from 'store/timeReport';
import {IData, ILinks, IMeta, IQueryTransformed, ITable} from 'store/report';

import styles from './time.module.scss';
import {QueryParamsAggregator, NavPanel} from 'components';

type NewThunkDispatch = ThunkDispatch<ITimeReportState, null, AnyAction>;

interface IProps {
  reportGetter: (params: IQueryTransformed) => Promise<boolean>;
  data: IData | null;
  meta: IMeta | null;
  links: ILinks | null;
  isFetching: boolean;
}

class TimeReport extends React.Component<IProps> {

  public componentDidMount() {
    const {data} = this.props
    if (!data || !data.content.length) this.props.reportGetter({});
  }

  public render() {
    const {data, meta} = this.props;
    return (
      <div className={styles.SomeTest}>
        <NavPanel current={routes.time}/>
        {data ? data.content.map((tab: ITable, i: number) => (
          <QueryParamsAggregator
            key={i}
            transport={this.getQueryData}
            index={i}
            data={tab}
            meta={meta}
            datePicker
          />
        )) : null}
      </div>
    );
  }

  public getQueryData = (ind: number, params: IQueryTransformed) => {
    this.props.reportGetter(params);
  }
}

const mapStateToProps = (store: IAppState) => {
  return {
    data: store.timeReportState.data,
    meta: store.timeReportState.meta,
    links: store.timeReportState.links,
    isFetching: store.timeReportState.isFetching,
  };
};

const mapDispatchToProps = (dispatch: NewThunkDispatch) => {
  return {
    reportGetter: (params: IQueryTransformed) => dispatch(getTimeReportData(params))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeReport);
