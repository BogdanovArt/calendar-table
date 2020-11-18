import * as React from 'react';

import {
  IQuery,
  IQueryTransformed,
  ITable,
  IMeta,
  queryValue,
} from 'store/report';
import {Pager, Picker, TableWrapper} from '..';
import {queryTransformer} from 'utils';


interface IState {
  queries: IQuery;
}

interface IWrapper {
  transport: (ind: number, params: IQueryTransformed) => void;
  index: number;
  data: ITable | null;
  meta: IMeta | null;
  pagination: boolean;
  datePicker: boolean;
}

export class QueryParamsAggregator extends React.Component <IWrapper, IState> {

  public static defaultProps: IWrapper = {
    data: null,
    meta: null,
    index: 0,
    transport: () => null,
    pagination: true,
    datePicker: false,
  };

  public state: IState = {
    queries: {}
  }

  public render() {
    const {data, meta, datePicker, pagination} = this.props;
    return (
      <>
        {datePicker && <Picker transport={this.setQueries} />}
        <TableWrapper {...data} transport={this.setQueries} sort={this.state.queries.sort} />
        {pagination && <Pager transport={this.setQueries} pagination={meta ? meta.pagination : undefined}/>}
      </>
    );
  }

  private setQueries = (key: string, val: queryValue) => {
    const {index, transport} = this.props;
    const queries = Object.assign(this.state.queries);
    if (!val && key) delete queries[key];
    else queries[key] = val;
    if (key === 'sort') delete queries.page;
    this.setState({queries}, () => {});
    const query = queryTransformer(queries);
    transport(index, query);
  }
}
