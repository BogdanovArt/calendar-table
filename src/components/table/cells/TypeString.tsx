import * as React from 'react';
import {IRowStringType} from 'store/report';

import styles from './cells.module.scss';

interface IState {
}

export class TypeString extends React.Component <IRowStringType, IState> {
  public static defaultProps: IRowStringType = {
    value: ''
  };

  public state: IState = {};

  private wrapperRef = React.createRef<HTMLDivElement>();

  public render() {
    const {value} = this.props;
    return (
      <>
        <div className={styles.StringType}>{value}</div>
      </>
    );
  }
}
