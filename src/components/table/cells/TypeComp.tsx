import * as React from 'react';
import {IRowCompType} from 'store/report';

import styles from './cells.module.scss';

interface IState {
}

export class TypeComp extends React.Component <IRowCompType, IState> {
  public static defaultProps: IRowCompType = {
    value1: '',
  };

  public state: IState = {};

  private wrapperRef = React.createRef<HTMLDivElement>();

  public render() {
    const values =  Object.values(this.props);
    return (
      <>
        <div className={styles.CompType}>
          {
            values.map((el, i) => {
              return el && (
                <div className={styles.CellContent} key={i}>
                  {!i ?
                    <span>{el}</span>
                  :
                    <>
                      <span className={styles.Divider}>/</span>
                      <span className={styles.Total}>{el}</span>
                    </>
                  }
                </div>
              )
            })
          }
        </div>
      </>
    );
  }
}
