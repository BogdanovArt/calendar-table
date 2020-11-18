import * as React from 'react';
import DayPicker, {DateUtils} from 'react-day-picker';
import cn from 'classnames/bind';
import 'react-day-picker/lib/style.css';
import './picker.css';

import {dateToString} from 'utils';

import style from './date.module.scss';
import {IPeriod, queryValue} from 'store/report';

const cx = cn.bind(style);

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const WEEKDAYS_LONG = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

const FIRST_DAY_OF_WEEK = 1;
// Translate aria-labels
const LABELS = {nextMonth: 'следующий месяц', previousMonth: 'предыдущий месяц'};

const TAGS = {
  year: 'год',
  month: 'месяц',
  week: 'неделя',
  day: 'день',
}

enum per {
  y = 'year',
  m = 'month',
  w = 'week',
  d = 'day',
}


interface IPicker {
  transport: (key: string, val: queryValue) => void;
}

interface IState {
  from: Date | null;
  to: Date | null;
  enteredTo: string | Date | null;
  initialDate: Date;
  selectedPeriod: string | null;
  isPickerVisible: boolean;
}

const getShifterDate = (date: Date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);

const getDateCopy = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export class Picker extends React.Component <IPicker, IState> {

  public static defaultProps: IPicker = {
    transport: () => null
  };

  public state: IState = {
    from: null,
    to: null,
    enteredTo: null,
    initialDate: new Date(),
    selectedPeriod: per.w,
    isPickerVisible: false,
  };

  public componentDidMount() {
    this.pickCurrentPeriod(per.w)
  }

  public render() {
    const {from, to, enteredTo, initialDate, selectedPeriod} = this.state;
    const modifiers = {start: from, end: enteredTo};
    const selectedDays = [from, {from, to: enteredTo}];
    return (
      <div className={style['picker-wrapper']}>
        <div className={style['picker-controls']}>
          <div className={style['picker-controls-toggler']}>
            {this.renderButton('\u25C0\u200A', false)}
            <div
              className={style['dates-picked']}
              onClick={this.togglePicker}
            >
              {from
                ? <>
                  <span className={style['date-picked']}>{dateToString(from, '.')}</span>
                  {(to && dateToString(from) !== dateToString(to)) &&
                  <span className={style['date-picked']}>- {dateToString(to, '.')}</span>}
                </>
                : <div>Выберите период</div>
              }
            </div>
            {this.renderButton('\u200A\u25B6', true)}
          </div>
          <button
            onClick={() => this.setPeriod(per.y)}
            className={cx('picker-button', 'tag', `${selectedPeriod && selectedPeriod === per.y ? '--active' : ''}`)}
          >
            {TAGS[per.y]}
          </button>
          <button
            onClick={() => this.setPeriod(per.m)}
            className={cx('picker-button', 'tag', `${selectedPeriod && selectedPeriod === per.m ? '--active' : ''}`)}
          >
            {TAGS[per.m]}
          </button>
          <button
            onClick={() => this.setPeriod(per.w)}
            className={cx('picker-button', 'tag', `${selectedPeriod && selectedPeriod === per.w ? '--active' : ''}`)}
          >
            {TAGS[per.w]}
          </button>
          <button
            onClick={() => this.setPeriod(per.d)}
            className={cx('picker-button', 'tag', `${selectedPeriod && selectedPeriod === per.d ? '--active' : ''}`)}
          >
            {TAGS[per.d]}
          </button>

        </div>
        <div className={cx('day-picker-wrapper', `${ this.state.isPickerVisible ? 'day-picker-wrapper--active' : ''}`)}>
          <DayPicker
            locale='ru'
            className='Range'
            months={MONTHS}
            weekdaysLong={WEEKDAYS_LONG}
            weekdaysShort={WEEKDAYS_SHORT}
            firstDayOfWeek={FIRST_DAY_OF_WEEK}
            labels={LABELS}
            numberOfMonths={3}
            canChangeMonth={false}
            showWeekNumbers
            month={getShifterDate(initialDate)}
            onWeekClick={this.handleWeekClick}
            selectedDays={selectedDays}
            modifiers={modifiers}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
            captionElement={({date}: { date: Date }) => this.customCaption({date})}
          />
          <div className={style['transport-controls']}>
            <button
              className={cx(style['transport-button'], style['cancel'])}
              onClick={() => {
                this.handleResetClick();
                this.setState({isPickerVisible: false});
              }}
            >Отмена
            </button>
            <button
              className={cx(style['transport-button'], style['save'])}
              onClick={() => {
                this.transportCaller(true);
                this.setState({isPickerVisible: false});
              }}
            >Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  }

  public getInitialState = (): IState => {
    return {
      from: null,
      to: null,
      enteredTo: null, // Keep track of the last day for mouseEnter.
      initialDate: this.state.initialDate,
      selectedPeriod: null,
      isPickerVisible: this.state.isPickerVisible,
    };
  }

  private customCaption = ({date}: { date: Date }) => {
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return (
      <div
        className={'DayPicker-Caption'}
        onClick={() => this.handleMonthClick(date)}
      >
        <span>{month}</span>
        {(!date.getMonth() || date.getMonth() === 11) && <span className={'Caption-Year'}>{year}</span>}
      </div>
    )
  }

  private togglePicker = () => {
    this.setState({isPickerVisible: !this.state.isPickerVisible})
  }

  private handleMonthClick = (date: Date) => {
    this.setState({initialDate: date}, () => this.pickCurrentPeriod(per.m));
  }

  private renderButton(str: string, next: boolean) {
    const {selectedPeriod} = this.state;
    const step = next ? 1 : -1;
    switch (selectedPeriod) {
      case per.y:
        return (<button
          className={style['picker-button']}
          onClick={() => this.setInitialDate({y: step})}
        >{str}</button>);
      case per.w:
        return (<button
          className={style['picker-button']}
          onClick={() => this.setInitialDate({w: step})}
        >{str}</button>);
      case per.d:
        return (<button
          className={style['picker-button']}
          onClick={() => this.setInitialDate({d: step})}
        >{str}</button>);
      case per.m:
        return (<button
          className={style['picker-button']}
          onClick={() => this.setInitialDate({m: step})}
        >{str}</button>);
      default:
        return (<button
          className={style['picker-button']}
          onClick={() => this.pickerNav(next)}
        >{str}</button>);
    }
  }

  public setPeriod = (str?: string): void => {
    if (str && str === this.state.selectedPeriod) {
      this.setState(this.getInitialState(), () => this.transportCaller(true))
    } else {
      this.setState({selectedPeriod: str || null, initialDate: new Date()}, () => this.pickCurrentPeriod(str))
    }
  }

  public pickCurrentPeriod = (str?: string): void => {
    const selDate = getDateCopy(this.state.initialDate);
    const {isPickerVisible} = this.state;
    switch (str) {
      case per.y:
        const janFirst = new Date(selDate.getFullYear(), 0, 1);
        const decLast = new Date(selDate.getFullYear(), 12, 0);
        this.setState({
          from: janFirst,
          to: decLast,
          enteredTo: decLast,
        }, () => {
          this.transportCaller(!isPickerVisible);
        });
        break;
      case per.m:
        const first = new Date(selDate.getFullYear(), selDate.getMonth(), 1);
        const last = new Date(selDate.getFullYear(), selDate.getMonth() + 1, 0);
        this.setState({
          from: first,
          to: last,
          enteredTo: last,
        }, () => {
          this.transportCaller(!isPickerVisible);
        });
        break;
      case per.w:
        const day = selDate.getDay();
        // const bef = 6 - day;
        const mon = new Date(selDate.setDate(selDate.getDate() - day + (day === 0 ? -6 : 1)));
        const sun = new Date(selDate.setDate(mon.getDate() + 6));
        this.setState({
          from: mon,
          to: sun,
          enteredTo: sun,
        }, () => {
          this.transportCaller(!isPickerVisible);
        });
        break;
      case per.d:
        this.setState({
          from: selDate,
          to: selDate,
          enteredTo: selDate,
        }, () => {
          this.transportCaller(!isPickerVisible);
        });
        break;
      default:
        break;
    }
  }

  public setInitialDate = ({y, m, w, d}: { y?: number; m?: number; w?: number; d?: number }) => {
    const newDate = getDateCopy(this.state.initialDate);
    switch (true) {
      case !!y:
        newDate.setFullYear(newDate.getFullYear() + (y || 0));
        this.setState({initialDate: newDate}, () => this.pickCurrentPeriod(per.y));
        break;
      case !!m:
        newDate.setMonth(newDate.getMonth() + (m || 0));
        this.setState({initialDate: newDate}, () => this.pickCurrentPeriod(per.m));
        break;
      case !!w:
        newDate.setDate(newDate.getDate() + (w || 0) * 7);
        this.setState({initialDate: newDate}, () => this.pickCurrentPeriod(per.w));
        break;
      case !!d:
        newDate.setDate(newDate.getDate() + (d || 0));
        this.setState({initialDate: newDate}, () => this.pickCurrentPeriod(per.d));
        break;
      default:
        break;
    }
  }

  public pickerNav(fwd?: boolean): void {
    const newDate = getDateCopy(this.state.initialDate);
    newDate.setMonth(newDate.getMonth() + (fwd ? 1 : -1));
    this.setState({initialDate: newDate})
  }

  public handleWeekClick = (w: any, d: Date[], e: any) => {
    this.setState({
      from: d[0],
      to: d[d.length - 1],
      enteredTo: d[d.length - 1],
      selectedPeriod: null,
    })
  }

  public isSelectingFirstDay = (from: string | Date | null, to: string | Date | null, day: string | Date | null): boolean => {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  public handleDayClick = (day: Date): void => {
    const {from, to} = this.state;
    this.setState({selectedPeriod: null})
    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
      });
    } else {
      this.setState({
        to: day,
        enteredTo: day,
      });
    }
  }

  public handleDayMouseEnter = (day: string | null) => {
    const {from, to} = this.state;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }

  public handleResetClick = () => {
    this.setState(this.getInitialState());
  }

  public transportCaller = (greenLight?: boolean): void => {
    const {from, to} = this.state;
    const start = dateToString(from, undefined, true);
    const end = dateToString(to, undefined, true);
    const payload = (start && end) ? { start, end } : null;
    if (greenLight) {
      this.props.transport( 'period', payload as IPeriod);
    }
  }
}
