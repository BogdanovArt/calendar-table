import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';

import {routes} from 'routes';
import {IAppState} from 'store/rootReducers';
import {getReportData, IReportState, IData, ILinks, IMeta, ITable, IQueryTransformed} from 'store/report';
import {QueryParamsAggregator, NavPanel} from 'components';

import styles from './styles.module.scss';

type NewThunkDispatch = ThunkDispatch<IReportState, null, AnyAction>;

interface IProps {
  reportGetter: (params: IQueryTransformed) => Promise<boolean>;
  data: IData | null;
  meta: IMeta | null;
  links: ILinks | null;
  isFetching: boolean;
}

class Home extends React.Component<IProps> {

  public componentDidMount() {
    this.props.reportGetter({});
  }

  public render() {
    const {data, meta} = this.props;
    return (
      <div className={styles.SomeTest}>
        <NavPanel current={routes.deal}/>
        {data ? data.content.map((tab: ITable, i: number) => (
          <QueryParamsAggregator
            key={i}
            transport={this.getQueryData}
            index={i}
            data={tab}
            meta={meta}
          />
        )) : null}
      </div>
    );
  }

  public getQueryData = (ind: number, params: IQueryTransformed) => {
    this.props.reportGetter(params);
  }
}

// Grab the characters from the store and make them available on props
const mapStateToProps = (store: IAppState) => {
  return {
    data: store.reportState.data,
    meta: store.reportState.meta,
    links: store.reportState.links,
    isFetching: store.reportState.isFetching,
  };
};

const mapDispatchToProps = (dispatch: NewThunkDispatch) => {
  return {
    reportGetter: (params: IQueryTransformed) => dispatch(getReportData(params))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
