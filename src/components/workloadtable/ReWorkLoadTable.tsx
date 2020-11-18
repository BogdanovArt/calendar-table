import * as React from 'react';

import {
  ICoordinates,
  IEntityOrder,
  IPosition,
  IWorkLoadTableProps,
  IWorkLoadTableState
} from './interfaces';
import {formatDate, getQuery, q, queryGet, querySet, getOpened, checkTimestamp, weeksInYear, getWeekIndex} from 'utils';
import {ViewTypes, ViewTypesOrder} from 'store/workload/enums';
import {Entities, RowActions} from './enums';
import {ScrollWidget, TableBody, Preloader} from './blocks';
import styles from './workload.module.scss';

class WorkLoadTable extends React.Component<IWorkLoadTableProps, IWorkLoadTableState> {

  static defaultProps: IWorkLoadTableProps = {
    headers: [],
    columns: {},
    fetching: false,
    viewType: ViewTypesOrder[ViewTypes.UPT],
    addEntity: () => null,
    removeEntity: () => null,
    addWeeks: () => new Promise((resolve => null)),
    getWorkLoadData: () => new Promise((resolve => null)),
  }


  state: IWorkLoadTableState = {
    scrolling: false,
    current: '',
    activeIndex: 0,
    active: '',
    cellWidth: 188,
    position: 0,
    scrollByTable: false,
    scrollByWidget: false,
    handlePosition: { x: 0, y: 0 },
    loadedWeeks: {
      start: 0,
      end: 0,
    },
    opened: undefined,
  }

  scrollRef = React.createRef<HTMLDivElement>();
  handleRef = React.createRef<HTMLDivElement>();
  activeRef = React.createRef<HTMLDivElement>();
  tableRef = React.createRef<HTMLDivElement>();

  /* --------- --------- --------- event handler methods --------- --------- ---------  */

  expandHandler = (
    entity: Entities,
    target: string,
    ids: IEntityOrder,
    type: string,
    index: number
  ): void => {
    if (type === RowActions.ADD) {
      this.props.addEntity(entity, target, ids, this.props.viewType);
    } else {
      this.props.removeEntity(entity, target, ids, this.props.viewType);
    }
    const opened = queryGet(q.opened) || [];

    getOpened({ 
      opened,
      viewType: ViewTypesOrder[ViewTypes.UPT],
      data: ids,
    });
    querySet(q.opened, opened);
  }

  weekClickHandler = (week?: number): void => {
    if (week !== undefined) this.setAllPositions(week);
  }

  handleScrollHandler = (pos: IPosition): void => {
    const week = this.getWeekByX(pos.x);
    const { start, end } = this.state.loadedWeeks;
    if (week && week >= start && week <= end) {
      const parent = this.scrollRef.current;
      let weekWidth: number;
      if (parent) {
        weekWidth = (parent.scrollWidth - 2) / weeksInYear();
        const offsetLeft = weekWidth * (start - 1);
        const tableOffset = (pos.x - offsetLeft) / weekWidth * this.state.cellWidth;
        this.scrollTable(tableOffset);
      }
    }
  }

  handleStopHandler = (pos: ICoordinates): void => {
    const { x } = pos;
    const week: number | undefined = this.getWeekByX(x) || this.state.activeIndex;
    this.setAllPositions(week);
  }

  mouseUpHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (this.state.scrolling) {
      this.tableStickyScroll();
      this.setHandleTransition('.2s');
      this.setState({ scrolling: false });
    }
  }

  mouseDownHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === this.tableRef.current) {
      this.setHandleTransition('none');
      this.setState({ scrolling: true });
    }
  }

  tableScrollHandler = (event: React.UIEvent<HTMLElement>): void => {
    if (this.state.scrolling) {
      const 
        table = event.target as HTMLElement,
        { start } = this.state.loadedWeeks,
        parent = this.scrollRef.current,
        weekWidth = parent ? (parent.scrollWidth - 2) / weeksInYear() : 0,
        offsetBase = weekWidth * (start - 1),
        offsetAdd = weekWidth / this.state.cellWidth * table.scrollLeft;
      this.setHandlePosition(offsetBase + offsetAdd, 0);
    }
  }

  /* --------- --------- --------- get methods --------- --------- ---------  */

  // получение штампа загруженной(!) недели
  getWeekId = (index: number): string | undefined => {
    return Object.keys(this.props.columns).find(week => index === getWeekIndex(week));    
  }

  // получение параметров диапазона для запроса дозагрузки недель
  static getWeekRange = (ref: number, rel: number, refWeek: string): { [key: string]: string }  => {
    const 
      week = new Date(parseInt(refWeek, 10)),
      diff = ref - rel,
      time = week.getTime() - diff * 7 * 86400000,
      newWeek = new Date(time);
    return {
      [q.date_start]:  diff > 0 ? formatDate(newWeek) : formatDate(week),
      [q.date_end]: diff > 0 ? formatDate(week) : formatDate(newWeek),
    };
  }
  // получение х-координат отступа по порядковому номеру недели и коэффициенту отступа для навигатора
  getXByWeek = (index: number, offset?: number): number | undefined => {
    const parent = this.scrollRef.current;
    const handle = this.handleRef.current;
    if (parent && handle) {
      const weekWidth = (parent.scrollWidth - 2) / weeksInYear();
      const maxX = parent.scrollWidth - handle.clientWidth;
      let x = index ? (index - 1) * weekWidth : 0;
      if (offset) x = x - weekWidth * offset;
      return maxX < x ? maxX : x;
    }
  }

  // получение порядкового номера недели по координатам навигатора
  getWeekByX = (x: number): number | undefined => {
    if (this.scrollRef.current) {
      const weekWidth = (this.scrollRef.current.scrollWidth - 2) / weeksInYear();
      return Math.ceil((x + 2) / weekWidth);
    }
  }

  getTableOffset = (index: number): number => {
    const weeks = Object.keys(this.props.columns).sort();
    const key = this.getWeekId(index);
    const colIndex = weeks.findIndex((week: string) => week === key);
    return colIndex * this.state.cellWidth;
  }

  // получение коэффициента отступа (в неделях - напр. 2.48 недель) для навигатора исходя из вьюпорта таблицы
  getTableViewPosition = (week: number): number | undefined => {
    const id = this.getWeekId(week);
    let offset: number | undefined;
    if (id) {
      const weekOffset = this.getTableOffset(week);
      if (weekOffset) {
        const table = this.tableRef.current as HTMLElement;
        const scrollable = table.scrollWidth - table.clientWidth;
        if (weekOffset > scrollable) {
          offset = (weekOffset - scrollable) / this.state.cellWidth;
        }
      }
    }
    return offset;
  }

  /* --------- --------- --------- set methods --------- --------- ---------  */

  setActiveWeekIndex(index: number): void {
    const week = this.getWeekId(index);
    querySet(q.active, week);
    this.setState({ activeIndex: index, active: week || '' }, () => {
      if (!week && this.props.headers.length) {
        this.fetchNewWeeks(index);
      }
    });    
  }

  setHandleByWeek = (week: number): void => {
    const offset = this.getTableViewPosition(week);
    const x = this.getXByWeek(week, offset);
    this.setHandlePosition(x || 0, 0);
  }

  setHandlePosition = (x: number, y: number): void => {
    this.setState({ handlePosition: { x, y }});
  }

  setHandleTransition = (value: string): void => {
    const handle = this.handleRef.current;
    if (handle) handle.style.transition = value;
  }

  setAllPositions = (index: number): void => {
    this.setActiveWeekIndex(index);
    this.setHandleByWeek(index);
    this.scrollToWeek({ index, smooth: true });
  }

  scrollToWeek({ index, smooth }: {
    index: number;
    smooth?: boolean;
  }): void {
    const offset = this.getTableOffset(index);
    if (offset >= 0) this.scrollTable(offset, smooth);
  }

  scrollTable(left: number, smooth?: boolean ): void {
    (this.tableRef.current as HTMLElement).scrollTo({ left: left, behavior: smooth ? 'smooth' : 'auto' });
  }

  syncHandleWidth(): void {
    const 
      table = this.tableRef.current,
      handle = this.handleRef.current,
      handleContainer = this.scrollRef.current;
    if (table && handle && handleContainer) {
      const 
        cellShown = table.clientWidth / this.state.cellWidth,
        weekNumCell = handleContainer.clientWidth / weeksInYear(),
        newHandleWidth = cellShown * weekNumCell + 1;
      handle.style.width = newHandleWidth + 'px';
    }
  }

  tableStickyScroll(): void {
    const 
      table = this.tableRef.current as HTMLElement,
      { cellWidth } = this.state,
      scrolled = table.scrollLeft,
      closest = scrolled % cellWidth;

    let index = closest / cellWidth >= 0.5
      ? Math.ceil(scrolled / cellWidth)
      : Math.floor(scrolled / cellWidth);
    index += this.state.loadedWeeks.start;
    this.setAllPositions(index);
  }

  async fetchNewWeeks(index: number): Promise<void> {
    const {start, end} = this.state.loadedWeeks;
    if (start !== index && end !== index) {
      let range;
      if (index < start) {
        range = WorkLoadTable.getWeekRange(start, index, this.getWeekId(start) || '');
      } else {
        range = WorkLoadTable.getWeekRange(end, index, this.getWeekId(end) || '');
      }
      const params = {
        ...getQuery(),
        ...range,
        view_type: ViewTypes.UPT,
      }
      await this.props.addWeeks(params);    
      this.setAllPositions(index);
      this.setWeeksQuery();
    }
    // console.log(start, end, index, 'fetchweeks');    
    // perform correction methods here;
  }

  setWeeksQuery = () => {
    const 
        weeks = Object.keys(this.props.columns).sort(),
        first = checkTimestamp(weeks[0]),
        last = checkTimestamp(weeks[weeks.length - 1]),
        start = getWeekIndex(first),
        end = getWeekIndex(last);
      if (first && last) {
        const        
          firstDate = formatDate(new Date(parseInt(first))),
          lastDate = formatDate(new Date(parseInt(last)));
        querySet(q.date_start, firstDate);
        querySet(q.date_end,  lastDate);
      }
      const loadedWeeks = { start: start >= weeksInYear() ? 1 : start, end };
      this.setState({ loadedWeeks });
  }

  resetQuery = async () => {
    await this.props.getWorkLoadData({});
    const active = queryGet(q.active) || new Date().getTime().toString();
    const index = getWeekIndex(active);
    this.setActiveWeekIndex(index);
    this.setAllPositions(this.state.activeIndex);
    this.setWeeksQuery();
    querySet(q.opened, null);
    querySet(q.date_start, null);
    querySet(q.date_end, null);
  }
 
  onMounted = async () => {    
    const active = queryGet(q.active) || new Date().getTime().toString();
    const index = getWeekIndex(active);
    querySet(q.active, active);
    const query = { 
      ...getQuery(),
      view_type: ViewTypes.UPT,
     };
    await this.props.getWorkLoadData(query);
    this.setAllPositions(index);
    this.setWeeksQuery();
  }

  componentDidUpdate(prevP: IWorkLoadTableProps) {
    if ((this.props.fetching !== prevP.fetching) && !this.props.fetching) {
      this.syncHandleWidth();
      this.setAllPositions(this.state.activeIndex);
    }
  }

  componentDidMount(): void {
    this.onMounted();
  }

  render(): JSX.Element {
    const { fetching, columns } = this.props;
    return (
      <React.Fragment>
        <button className={styles['eject-button']} onClick={this.resetQuery}>x</button>
        <ScrollWidget
          scrollHandler={this.handleScrollHandler}
          stopHandler={this.handleStopHandler}
          clickHandler={this.weekClickHandler}
          loadedWeeks={this.state.loadedWeeks}
          position={this.state.handlePosition}
          index={this.state.activeIndex}
          containerRef={this.scrollRef}
          handleRef={this.handleRef}
          fetching={fetching}
        />
        <div className={styles.table__wrapper}>
          <div
            ref={this.tableRef}
            className={styles.table__scroll}
            onScroll={this.tableScrollHandler}
            onMouseDown={this.mouseDownHandler}
            onMouseUp={this.mouseUpHandler}
          >
            <Preloader fetching={fetching} />
            <TableBody
              expandHandler={this.expandHandler}
              weekClickHandler={this.weekClickHandler}
              headers={this.props.headers}
              columns={columns}
              activeRef={this.activeRef}
              active={this.state.active}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default WorkLoadTable;
