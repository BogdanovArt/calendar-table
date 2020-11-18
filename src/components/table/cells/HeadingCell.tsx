import * as React from 'react';
import cn from 'classnames';

import styles from './cells.module.scss';
import {GLOBAL} from 'globals/enums';
import {IOrder, queryValue} from '../../../store/report';


const cx = cn.bind(styles);

interface IProps {
  order: IOrder;
  toggle: (key: string, val: queryValue) => void;
  sortKey: string;
}

interface IState {
}

export class HeadingCell extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    order: null,
    sortKey: '',
    toggle: () => false,
  };

  private wrapperRef = React.createRef<HTMLDivElement>();

  public render() {
    const {order, children } = this.props;
    return (
      <>
        <div className={cx(styles.HeadingCell, {[styles.Active]: !!order })} onClick={this.toggleSort}>
          {children}
          {order &&
          <>
            {(order !== 'asc')
            ? <span> &#8681;</span>
            : <span> &#8679;</span>
            }
          </>}
        </div>
      </>
    );
  }
  private toggleSort = () => {
    const {order, toggle, sortKey} = this.props;
    let newOrder = null;
    switch (order) {
      case null:
        newOrder = GLOBAL.SORT_DESC;
        break;
      case GLOBAL.SORT_ASC:
        newOrder = null;
        break;
      case GLOBAL.SORT_DESC:
        newOrder = GLOBAL.SORT_ASC;
        break;
    }
    const val = newOrder ? {key: sortKey, order: newOrder as IOrder} : null
    toggle('sort', val);
  }
}
