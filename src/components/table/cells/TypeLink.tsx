import * as React from 'react';
import {IRowLinkType} from 'store/report';

import styles from './cells.module.scss';

interface IState {
}

export class TypeLink extends React.Component <IRowLinkType, IState> {
  public static defaultProps: IRowLinkType = {
    title: '',
    link: '',
  };

  public state: IState = {};

  private wrapperRef = React.createRef<HTMLDivElement>();

  public render() {
    const {title, link} = this.props;
    return (
      <>
        <a className={styles.LinkType} href={link}>
          <div>
            {title}
          </div>
        </a>
      </>
    );
  }
}
