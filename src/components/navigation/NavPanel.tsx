import * as React from 'react';
import {Link} from 'react-router-dom';
import cn from 'classnames/bind';

import {routes} from 'routes';
import style from './nav.module.scss';

const cx = cn.bind(style);

interface INavPanel {
  current: string;
}

interface IState {
}
export class NavPanel extends React.Component <INavPanel, IState> {

  public static defaultProps: INavPanel = {
    current: '',
  };

  public state: IState = {
  };

  public render() {
    const {current} = this.props;
    return (
      <div className={style['nav-wrapper']}>
        <Link to={routes.deal}>
          <div className={cx('NavTab', `${ current === routes.deal ? 'NavActive' : '' }`)}>Отчет по сделкам</div>
        </Link>
        <Link to={routes.time}>
          <div className={cx('NavTab', `${ current === routes.time ? 'NavActive' : '' }`)}>Отчет по времени</div>
        </Link>
        <Link to={routes.workload}>
          <div className={cx('NavTab', `${ current === routes.workload ? 'NavActive' : '' }`)}>Отчет по нагрузке</div>
        </Link>
      </div>
    );
  }

}
