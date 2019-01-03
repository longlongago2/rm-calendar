import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import slideRenderer, { goDateBoard } from './slideRenderer';
import styles from './index.less';

const VirtualizeSwipeableViews = virtualize(SwipeableViews);
const cx = classNames.bind(styles);

export default class RMCalendar extends Component {
  static turnWeekNumToChar(num) {
    switch (num) {
    case 0:
      return '日';
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    case 6:
      return '六';
    default:
      return null;
    }
  }

  static getDaysOfPerMonth(date) {
    // 获取（天/月）数据
    const year = date.getFullYear();
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      days[1] = 29;
    }
    return days;
  }

  static getDataOfHeader(firstDayOfWeek) {
    // 获取周排列数据
    const start = firstDayOfWeek;
    const week = [
      {
        day: 0,
        'zh-cn': '日',
        en: 'Sun',
      },
      {
        day: 1,
        'zh-cn': '一',
        en: 'Mon',
      },
      {
        day: 2,
        'zh-cn': '二',
        en: 'Tue',
      },
      {
        day: 3,
        'zh-cn': '三',
        en: 'Wed',
      },
      {
        day: 4,
        'zh-cn': '四',
        en: 'Thu',
      },
      {
        day: 5,
        'zh-cn': '五',
        en: 'Fri',
      },
      {
        day: 6,
        'zh-cn': '六',
        en: 'Sat',
      },
    ];
    const p1 = week.slice(start);
    const p2 = week.slice(0, start);
    return p1.concat(p2);
  }

  static getComposeDaysOfBoard(date, firstDayOfWeek = 0, order = 0) {
    // 获取面板组成天数据 [-1：获取上月组成天数 | 0：获取本月组成天数 | 1：获取下月组成天数]
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = new Date(year, month, 1).getDay();
    const daysOfPerMonth = RMCalendar.getDaysOfPerMonth(date);
    const weekCharacter = RMCalendar.getDataOfHeader(firstDayOfWeek);
    const theMonthNumOfBoard = daysOfPerMonth[month];
    let preMonthNumOfBoard = 0; // 上月组成天数
    for (let i = 0; i < weekCharacter.length; i++) {
      const item = weekCharacter[i];
      if (item.day === day) preMonthNumOfBoard = i;
    }
    if (order === -1) {
      // 上月组成天数
      return preMonthNumOfBoard;
    }
    if (order === 1) {
      // 下月组成天数
      const sumDays = 6 * 7;
      return sumDays - theMonthNumOfBoard - preMonthNumOfBoard;
    }
    // 本月组成天数
    return theMonthNumOfBoard;
  }

  static getDataOfBoard(date, firstDayOfWeek) {
    // 获取面板所有日期数据
    const TC = RMCalendar;
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysOfPerMonth = TC.getDaysOfPerMonth(date);
    const preMonthNum = TC.getComposeDaysOfBoard(date, firstDayOfWeek, -1);
    const theMonthNum = TC.getComposeDaysOfBoard(date, firstDayOfWeek, 0);
    const nextMonthNum = TC.getComposeDaysOfBoard(date, firstDayOfWeek, 1);
    return new Array(42).fill(null).map((item, i) => {
      // 验证数据范围：1900-2099
      if (year < 1900 || year > 2099) return false;
      // 上月数据
      if (i < preMonthNum) {
        const preMonth = month - 1 >= 0 ? month - 1 : 11;
        const preMYear = month - 1 >= 0 ? year : year - 1;
        if (preMYear < 1900) return false;
        return {
          day: daysOfPerMonth[preMonth] - preMonthNum + i + 1,
          month: preMonth,
          year: preMYear,
          monthIndex: -1,
        };
      }
      // 本月数据
      if (i < theMonthNum + preMonthNum) {
        const today = new Date();
        const thisYear = today.getFullYear();
        const thisMonth = today.getMonth();
        const thisDate = today.getDate();
        const data = {
          day: i + 1 - preMonthNum,
          month,
          year,
          monthIndex: 0,
        };
        if (thisDate === data.day && thisMonth === data.month && thisYear === data.year) {
          data.today = true; // 今日
        }
        return data;
      }
      // 下月数据
      const nextMonth = month + 1 <= 11 ? month + 1 : 0;
      const nextMYear = month + 1 <= 11 ? year : year + 1;
      if (nextMYear > 2099) return false;
      return {
        day: i - 41 + nextMonthNum,
        month: nextMonth,
        year: nextMYear,
        monthIndex: 1,
      };
    });
  }

  static getWeekRowOfBoard(date, firstDayOfWeek) {
    const TC = RMCalendar;
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dataOfBoard = TC.getDataOfBoard(date, firstDayOfWeek);
    if (Array.isArray(dataOfBoard) && dataOfBoard.length > 0) {
      for (let i = 0; i < dataOfBoard.length; i++) {
        const item = dataOfBoard[i];
        if (item.year === year && item.month === month && item.day === day) {
          return Math.floor(i / 7);
        }
      }
    }
    return 0;
  }

  static getComputedDataOfBoard(date, firstDayOfWeek, schedule) {
    // 获取合并后的日历日程表完整数据
    const TC = RMCalendar;
    const dataOfBoard = TC.getDataOfBoard(date, firstDayOfWeek, schedule);
    // 合并数据：将传入的日程数据合并到日历上
    return dataOfBoard.map((item) => {
      const itemBoardDate = moment(new Date(item.year, item.month, item.day)).format('YYYY-MM-DD');
      for (let i = 0; i < schedule.length; i++) {
        const itemSchedule = schedule[i];
        const itemScheduleDate = itemSchedule.date && moment(itemSchedule.date).format('YYYY-MM-DD');
        if (itemBoardDate === itemScheduleDate) {
          return {
            ...item,
            data: itemSchedule,
          };
        }
      }
      return item;
    });
  }

  // static getDerivedStateFromProps(props, state) {
  //   // 初始化和每次setState都会触发此钩子函数：可以用于监听props
  //   const TC = RMCalendar;
  //   let update = false;
  //   // 活动属性：date,type,firstDayOfWeek,schedule 活动属性变化会触发一系列内部更新
  //   const newState = { prevProps: Object.assign({}, state.prevProps) };
  //   const propsDate = JSON.stringify({
  //     year: props.date.getFullYear(),
  //     month: props.date.getMonth(),
  //     day: props.date.getDate(),
  //   });
  //   const prevPropsDate = JSON.stringify({
  //     year: state.prevProps.date.getFullYear(),
  //     month: state.prevProps.date.getMonth(),
  //     day: state.prevProps.date.getDate(),
  //   });
  //   const propsSchedule = JSON.stringify(props.schedule);
  //   const prevPropsSchedule = JSON.stringify(state.prevProps.schedule);
  //   if (propsDate !== prevPropsDate) {
  //     // 对比日期只精确到天，否则毫秒时间永远不相等
  //     update = true;
  //     // change prevProps
  //     newState.prevProps.date = props.date;
  //     // change state
  //     newState.weekRowIndex = TC.getWeekRowOfBoard(props.date, props.firstDayOfWeek);
  //     newState.dataOfBoard = TC.getComputedDataOfBoard(
  //       props.date,
  //       props.firstDayOfWeek,
  //       props.schedule,
  //     );
  //     newState.selectDate = {
  //       year: props.date.getFullYear(),
  //       month: props.date.getMonth(),
  //       day: props.date.getDate(),
  //     };
  //   }
  //   if (props.type !== state.prevProps.type) {
  //     update = true;
  //     // change prevProps
  //     newState.prevProps.type = props.type;
  //     // change state
  //     newState.type = props.type;
  //   }
  //   if (props.firstDayOfWeek !== state.prevProps.firstDayOfWeek) {
  //     update = true;
  //     // change prevProps
  //     newState.prevProps.firstDayOfWeek = props.firstDayOfWeek;
  //     // change state
  //     const { year, month, day } = state.selectDate;
  //     const selectDate = new Date(year, month, day);
  //     newState.dataOfHeader = TC.getDataOfHeader(props.firstDayOfWeek);
  //     newState.weekRowIndex = TC.getWeekRowOfBoard(selectDate, props.firstDayOfWeek);
  //     newState.dataOfBoard = TC.getComputedDataOfBoard(
  //       selectDate,
  //       props.firstDayOfWeek,
  //       props.schedule,
  //     );
  //   }
  //   if (propsSchedule !== prevPropsSchedule) {
  //     // 对比数组：转化成json字符串
  //     update = true;
  //     // change prevProps
  //     newState.prevProps.schedule = props.schedule;
  //     // change state
  //     const { year, month, day } = state.selectDate;
  //     const selectDate = new Date(year, month, day);
  //     newState.dataOfBoard = TC.getComputedDataOfBoard(
  //       selectDate,
  //       props.firstDayOfWeek,
  //       props.schedule,
  //     );
  //   }
  //   if (update) return newState;
  //   return null;
  // }

  constructor(props) {
    super(props);
    let { date } = props;
    if (date.getFullYear() < 1900) date = new Date(1900, 0, 1); // date设置最小值
    if (date.getFullYear() > 2099) date = new Date(2099, 11, 31); // date设置最大值
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    /* eslint-disable react/no-unused-state */
    this.state = {
      prevProps: props, // 用于比对props变化,内部不宜setState,只在getDerivedStateFromProps中维护
      date,
      type: props.type,
      selectDate: { year, month, day }, // 选中日期:默认是属性的date
      cellHeight: 0, // 单元格高度
      dropdownlist: false,
      index: 0, // 滑动面板默认页索引
      switching: false, // 是否正在滑动
    };
    this.calendar = React.createRef();
    this.handleCellClick = this._handleCellClick.bind(this);
    this.handleResize = this._handleResize.bind(this);
    this.handleChangeType = this._handleChangeType.bind(this);
    this.handleChangeBoard = this._handleChangeBoard.bind(this);
    this.handleChangePage = this._handleChangePage.bind(this);
    this.handleSwitching = this._handleSwitching.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.handleResize);
  }

  _handleCellClick(item) {
    const { switching } = this.state;
    if (switching) return; // 正在滑动避免触发click事件
    if (!item || (item && item.year > 2099) || (item && item.year < 1900)) return; // 1900-2099
    const { onCellClick } = this.props;
    if (onCellClick) onCellClick(item);
    this.setState((state) => {
      const { year, month, day } = item;
      const { year: selectYear, month: selectMonth, day: selectDay } = state.selectDate;
      if (year !== selectYear || month !== selectMonth || day !== selectDay) {
        return {
          index: state.index + item.monthIndex,
          selectDate: { year, month, day },
        };
      }
      return null;
    });
  }

  _handleResize() {
    const cellHeight = Math.floor(this.calendar.current.querySelector('table').clientWidth / 7) - 10;
    this.setState((prevState) => {
      if (prevState.cellHeight !== cellHeight) {
        return {
          cellHeight,
        };
      }
      return null;
    });
  }

  _handleChangeType(type) {
    this.setState((state) => {
      if (state.type !== type) return { type };
      return null;
    });
  }

  _handleChangeBoard(go) {
    const { index } = this.state;
    const nextIndex = index + go;
    const { selectDate } = goDateBoard(nextIndex, this);
    this.setState({
      index: nextIndex, // 翻页
      selectDate,
    });
  }

  _handleChangePage(index) {
    const { selectDate } = goDateBoard(index, this);
    this.setState({ index, selectDate });
  }

  _handleSwitching(index, type) {
    requestAnimationFrame(() => {
      // 防止拖动时误触click事件
      const { switching } = this.state;
      if (type === 'move' && switching === false) {
        this.setState({ switching: true });
      }
      if (type === 'end' && switching === true) {
        this.timer = setTimeout(() => this.setState({ switching: false }), 300);
      }
    });
  }

  render() {
    const { firstDayOfWeek, toolbar, width } = this.props; // 非活动的属性，内部状态不随props变化而更新
    const {
      type, selectDate, dropdownlist, index,
    } = this.state;
    const selectDateTime = new Date(selectDate.year, selectDate.month, selectDate.day);
    return (
      <div ref={this.calendar}>
        {toolbar && (
          <div
            className={styles['top-bar']}
            style={{ width: typeof width === 'number' ? `${width}px` : width }}
          >
            <div className={styles.date}>
              <div
                className={styles['opt-btn']}
                role="button"
                tabIndex="0"
                onClick={() => this.setState(state => ({ dropdownlist: !state.dropdownlist }))}
              >
                <div className={styles.month}>{`${selectDate.month + 1}月`}</div>
                <div className={styles['week-year']}>
                  <div>
                    {type === 'week'
                      ? `第 ${moment(selectDateTime).format(firstDayOfWeek === 0 ? 'ww' : 'WW')} 周`
                      : `周${RMCalendar.turnWeekNumToChar(selectDateTime.getDay())}`}
                  </div>
                  <div className={cx('year', { up: !dropdownlist, down: dropdownlist })}>
                    {`${selectDate.year}年`}
                  </div>
                </div>
              </div>
              <div className={styles['turn-btn']}>
                <div
                  className={cx('btn', 'down', {
                    disabled:
                      selectDate.year < 1900
                      || (selectDate.year === 1900 && selectDate.month === 0),
                  })}
                  role="button"
                  tabIndex="-5"
                  onClick={() => this.handleChangeBoard(-1)}
                />
                <div
                  className={cx('btn', 'up', {
                    disabled:
                      selectDate.year > 2099
                      || (selectDate.year === 2099 && selectDate.month === 11),
                  })}
                  role="button"
                  tabIndex="-6"
                  onClick={() => this.handleChangeBoard(1)}
                />
              </div>
            </div>
            {dropdownlist && (
              <div className={styles.options}>
                <div className={styles.opt} role="button" tabIndex="-1" onClick={() => alert()}>
                  <i>月</i>
                  选择月份
                </div>
                <div className={styles.opt} role="button" tabIndex="-2" onClick={() => alert()}>
                  <i>年</i>
                  选择年份
                </div>
                <div
                  className={styles.opt}
                  role="button"
                  tabIndex="-3"
                  onClick={() => this.handleChangeType('month')}
                >
                  <i className={cx({ selected: type === 'month' })}>M</i>
                  月视图
                </div>
                <div
                  className={styles.opt}
                  role="button"
                  tabIndex="-4"
                  onClick={() => this.handleChangeType('week')}
                >
                  <i className={cx({ selected: type === 'week' })}>W</i>
                  周视图
                </div>
              </div>
            )}
          </div>
        )}
        <VirtualizeSwipeableViews
          slideCount={
            selectDate.year > 2099 || selectDate.year < 1900 ? 1 : 0
          }
          resistance
          enableMouseEvents
          index={index}
          onChangeIndex={this.handleChangePage}
          onSwitching={this.handleSwitching}
          slideRenderer={params => slideRenderer(params, this, RMCalendar)}
        />
      </div>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
RMCalendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  type: PropTypes.oneOf(['month', 'week']),
  firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
  schedule: PropTypes.arrayOf(PropTypes.object),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locale: PropTypes.oneOf(['zh-cn', 'en']),
  toolbar: PropTypes.bool,
  onCellClick: PropTypes.func,
};

RMCalendar.defaultProps = {
  date: new Date(),
  type: 'month',
  firstDayOfWeek: 0,
  schedule: [],
  width: '100%',
  locale: 'zh-cn',
  toolbar: true,
  onCellClick: null,
};
