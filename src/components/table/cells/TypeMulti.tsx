import * as React from 'react';
import {IRowCompType} from 'store/report';

import styles from './cells.module.scss';

interface IState {
}

export class TypeMulti extends React.Component <IRowCompType, IState> {
  public static defaultProps: IRowCompType = {
    value1: '',
  };

  public state: IState = {};

  private wrapperRef = React.createRef<HTMLDivElement>();

  public render() {
    const {value1, value2, value3} = this.props
    return (
      <>
        <div className={styles.CompType}>
         <span className={styles.MainValue}>{value1 || 0}</span>
         <span>(</span>
          <div className={styles.CellContent} >
            <span className={styles.Total}>{value2 || 0}</span>
            <span className={styles.Divider}>/</span>
            <span className={styles.Total}>{value3 || 0}</span>
          </div>
        <span>)</span>
        </div>
      </>
    );
  }
}
