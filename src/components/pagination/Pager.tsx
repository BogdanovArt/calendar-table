import * as React from 'react';
import cn from 'classnames/bind';
import 'react-day-picker/lib/style.css';

import style from './pager.module.scss';
import {IPagination, queryValue} from 'store/report';

const cx = cn.bind(style);

interface IPager {
  transport: (key: string, val: queryValue) => void;
  pagination: IPagination;
}

interface IState {
}

export class Pager extends React.Component <IPager, IState> {

  public static defaultProps: IPager = {
    transport: () => null,
    pagination: {
      total: 1,
      count: 1,
      per_page: 10,
      current_page: 1,
      total_pages: 1,
      links: undefined,
    },
  };

  public state: IState = {};

  public render() {
    const visible = this.visible();
    const {total_pages, current_page} = this.props.pagination;
    const isLast = current_page === total_pages;
    const isFirst = current_page === 1;
    return (
      <div className={style['pager-wrapper']}>
        {total_pages > 1 &&
        <>
          <button
            className={style['--prev']}
            disabled={isFirst}
            onClick={() => this.actionHandler(current_page - 1)}
          > &#9664; </button>
          {(total_pages > 5 && current_page > 3) && <button onClick={() => this.actionHandler(1)}>...</button>}
          {visible.map(el => (<button
            className={cx(`${current_page === el ? '--active' : ''}`)}
            key={el}
            onClick={() => this.actionHandler(el)}
          >{el}</button>))}
          {(total_pages > 5 && total_pages - current_page >= 3) &&
          <button onClick={() => this.actionHandler(total_pages)}>...</button>}
          <button
            className={style['--next']}
            disabled={isLast}
            onClick={() => this.actionHandler(current_page + 1)}
          > &#9654; </button>
        </>
        }
      </div>
    );
  }

  private visible = () => {
    const {total_pages, current_page} = this.props.pagination;
    if (total_pages > 5) {
      if (current_page <= 3) {
        return Array.from(Array(4).keys(), el => el + 1);
      } else if (total_pages - current_page <= 2) {
        return [total_pages - 3, total_pages - 2, total_pages - 1, total_pages];
      } else {
        return [current_page - 1, current_page, current_page + 1];
      }
    } else {
      return Array.from(Array(total_pages).keys(), el => el + 1);
    }
  }

  private actionHandler = (page: number) => {
    this.props.transport('page', page);
  }
}
