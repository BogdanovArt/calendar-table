import * as React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import {ICoordinates, IPosition, ILoadedWeeks} from '../../interfaces';
import {Preloader} from '../../blocks';

import styles from './scrollwidget.module.scss';
import { weeksInYear } from 'utils';

interface IWidgetProps {
  position: ICoordinates;
  loadedWeeks: ILoadedWeeks;
  index: number;
  containerRef: React.RefObject<HTMLDivElement> | undefined;
  handleRef: React.RefObject<HTMLDivElement> | undefined;
  fetching: boolean;
  scrollHandler: (pos: IPosition) => void;
  stopHandler: (pos: IPosition) => void;
  clickHandler: (week: number) => void;
}

interface IState {
  months: string[];
  weeks: number[];
}


class ScrollWidget extends React.Component<IWidgetProps, IState> {

  public static defaultProps: IWidgetProps = {
    position: { x: 0, y: 0 },
    loadedWeeks: { start: 0, end: 0 },
    index: 0,
    containerRef: undefined,
    handleRef: undefined,
    fetching: false,
    scrollHandler: () => null,
    stopHandler: () => null,
    clickHandler: () => null,
  }

  public state: IState = {
    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    weeks: Array.from(Array(weeksInYear()).keys()),
  }

  timeout: number | null = null;

  onStart = (): void => {
    this.setHandleTransition('none');
  };

  onStop: DraggableEventHandler = (e, data) => {
    this.setHandleTransition('.2s');
    this.props.stopHandler(data);
  };

  setHandleTransition = (str: string): void => {
    const handle = this.props.handleRef;
    if (handle && handle.current) {
      handle.current.style.transition = str;
    }
  };

  onManualDrag: DraggableEventHandler = (e, pos) => {
    this.props.scrollHandler(pos);
  };

  render(): JSX.Element {
    const { index, fetching, loadedWeeks } = this.props;
    const dragHandlers = {
      onStart: this.onStart,
      onStop: this.onStop,
      onDrag: this.onManualDrag
    };
    return (
      <div
        className={styles['scroll-widget']}
      >
        <Preloader fetching={fetching} />
        <div
          className={styles['scroll-widget__wrapper']}
          ref={this.props.containerRef}
        >
          <Draggable
            bounds={'parent'}
            {...dragHandlers}
            axis={'x'}
            position={this.props.position}
          >
            <div
              className={styles['scroll-widget__viewport']}
              ref={this.props.handleRef}
            >
              <span className={styles['scroll-widget__viewport__handle']}>|||</span>
            </div>
          </Draggable>
          <div className={styles['scroll-widget__week-names']}>
            { this.state.months.map((month: string) => {
              return(
                <div
                  key={month}
                  className={[
                    styles['scroll-widget__week-names__name'],
                  ].join(' ')}
                >
                  { month }
                </div>
              )
            }) }
          </div>

          <div className={styles['scroll-widget__weeks']}>

            { this.state.weeks.map((ind: number) => {
              const loaded = ind + 1 >= loadedWeeks.start && ind + 1 <= loadedWeeks.end;
              return(
                <div
                  key={ind}
                  className={[
                    styles['scroll-widget__week'],
                    ind + 1 === index ? styles['scroll-widget__week--active'] : '',
                    loaded ? styles['scroll-widget__week--loaded'] : ''
                  ].join(' ')}
                  onClick={(): void => this.props.clickHandler(ind + 1)}
                >
                  {ind + 1}
                </div>
              )
            }) }
          </div>

        </div>
      </div>
    );
  }
}

export default ScrollWidget;
