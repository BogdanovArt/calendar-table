import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {ParsedUrlQuery} from 'querystring';

import {routes} from 'routes';
import {NavPanel, ReWorkLoadTable} from 'components';
import {IEntityOrder, ITableData, ITablePageProps} from 'components/workloadtable/interfaces';
import {IAppState} from 'store/rootReducers';
import {addEntity, getWorkLoadData, removeEntity, addWeeks} from 'store/workload';
import {getQuery} from 'utils';
import {ViewTypes, ViewTypeArray} from 'store/workload/enums';

type NewThunkDispatch = ThunkDispatch<null, null, AnyAction>;

interface IProps extends ITablePageProps, MapDispatch {}

interface MapDispatch {
  removeEntity: (
    entity: string,
    target: string,
    order: IEntityOrder,    
    view: ViewTypeArray,
  ) => Promise<void>;
  addEntity: (
    entity: string,
    target: string,
    order: IEntityOrder,
    view: ViewTypeArray,
  ) => Promise<void>;
  getWorkLoadData: (query: ParsedUrlQuery) => Promise<void>;
  addWeeks: (query: any) => Promise<void>;
}

class WorkLoad extends React.Component<IProps> {
    render(): JSX.Element {
    const { fetching, headers, columns, addEntity, removeEntity, addWeeks, getWorkLoadData } = this.props;
    return (
      <div className={"workload-wrapper"}>
        <NavPanel current={routes.workload}/>
        <ReWorkLoadTable
          headers={headers}
          columns={columns}
          fetching={fetching}
          addEntity={addEntity}
          removeEntity={removeEntity}
          addWeeks={addWeeks}
          getWorkLoadData={getWorkLoadData}
        />
      </div>
    );
  }
}

const mapStateToProps = (store: IAppState): ITablePageProps => {
  return {
    headers: store.workLoadState.data.content.headers,
    columns: store.workLoadState.data.content.columns,
    fetching: store.workLoadState.isFetching,
  };
};

const mapDispatchToProps = (dispatch: NewThunkDispatch): MapDispatch => {
  return {
    removeEntity: (entity, target, order, view): Promise<void> => dispatch(removeEntity(entity, target, order, view)),
    addEntity: (entity, target, order, view): Promise<void> => dispatch(addEntity(entity, target, order, view)),
    getWorkLoadData: (query): Promise<void> => dispatch(getWorkLoadData(query)),
    addWeeks: (query): Promise<void> => dispatch(addWeeks(query)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkLoad);
