import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';
import styles from './index.less';

const cx = classNames.bind(styles);

export default class RMCalendar extends Component {
  constructor(props) {
    super(props);
    const { date, type, firstDayOfWeek, schedule } = props; // 需要触发组件内部更新的props
    this.calendar = React.createRef();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const TC = RMCalendar;
    this.state = {
      date, // 用作和 props 比对
      type, // 用作和 props 比对
      firstDayOfWeek, // 用作和 props 比对
      schedule, // 以上都用作和props比对,内部不宜setState,只在getDerivedStateFromProps中维护
      cellHeight: 0, // 单元格高度
      weekRowIndex: TC.getWeekRowOfBoard(date, firstDayOfWeek), // 当前日期所在周在当前日历面板中的行数
      dataOfWeek: TC.getDataOfWeek(firstDayOfWeek), // 面板列（周）数据
      dataOfBoard: TC.getComputedDataOfBoard(date, firstDayOfWeek, schedule), // 合成面板数据集
      selectDate: { year, month, day } // 选中日期:默认是属性的date
    };
    this.handleCellClick = this._handleCellClick.bind(this);
    this.handleResize = this._handleResize.bind(this);
  }

  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    type: PropTypes.oneOf(['month', 'week']),
    firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    schedule: PropTypes.array,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locale: PropTypes.oneOf(['zh-cn', 'en']),
    onCellClick: PropTypes.func
  };

  static defaultProps = {
    date: new Date(),
    type: 'month',
    firstDayOfWeek: 0,
    schedule: [],
    width: '100%',
    locale: 'zh-cn'
  };

  static getDaysOfPerMonth(date) {
    // 获取（天/月）数据
    const year = date.getFullYear();
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      days[1] = 29;
    }
    return days;
  }

  static getDataOfWeek(firstDayOfWeek) {
    // 获取周排列数据
    const start = firstDayOfWeek;
    const week = [
      {
        day: 0,
        'zh-cn': '日',
        en: 'Sun'
      },
      {
        day: 1,
        'zh-cn': '一',
        en: 'Mon'
      },
      {
        day: 2,
        'zh-cn': '二',
        en: 'Tue'
      },
      {
        day: 3,
        'zh-cn': '三',
        en: 'Wed'
      },
      {
        day: 4,
        'zh-cn': '四',
        en: 'Thu'
      },
      {
        day: 5,
        'zh-cn': '五',
        en: 'Fri'
      },
      {
        day: 6,
        'zh-cn': '六',
        en: 'Sat'
      }
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
    const weekCharacter = RMCalendar.getDataOfWeek(firstDayOfWeek);
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
    const day = date.getDate();
    const daysOfPerMonth = TC.getDaysOfPerMonth(date);
    const preMonthNum = TC.getComposeDaysOfBoard(date, firstDayOfWeek, -1);
    const theMonthNum = TC.getComposeDaysOfBoard(date, firstDayOfWeek, 0);
    const nextMonthNum = TC.getComposeDaysOfBoard(date, firstDayOfWeek, 1);
    return new Array(42).fill(null).map((item, i) => {
      if (i < preMonthNum) {
        // 上月数据
        const _month = month - 1 >= 0 ? month - 1 : 11;
        const _year = month - 1 >= 0 ? year : year - 1;
        return {
          day: daysOfPerMonth[_month] - preMonthNum + i + 1,
          month: _month,
          year: _year,
          monthIndex: -1
        };
      } else if (i < theMonthNum + preMonthNum) {
        // 本月数据
        const today = new Date();
        const thisYear = today.getFullYear();
        const thisMonth = today.getMonth();
        const thisDate = today.getDate();
        const data = {
          day: i + 1 - preMonthNum,
          month,
          year,
          monthIndex: 0
        };
        if (
          thisDate === data.day &&
          thisMonth === data.month &&
          thisYear === data.year
        ) {
          data.today = true; // 今日
        }
        if (day === data.day) data.selectDate = true; // 组件date属性的日期
        return data;
      } else {
        // 下月数据
        const _month = month + 1 <= 11 ? month + 1 : 0;
        const _year = month + 1 <= 11 ? year : year + 1;
        return {
          day: i - 41 + nextMonthNum,
          month: _month,
          year: _year,
          monthIndex: 1
        };
      }
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
    return dataOfBoard.map(item => {
      const date = moment(new Date(item.year, item.month, item.day)).format(
        'YYYY-MM-DD'
      );
      for (let i = 0; i < schedule.length; i++) {
        const item2 = schedule[i];
        if (item2.date && date === moment(item2.date).format('YYYY-MM-DD')) {
          return {
            ...item,
            data: item2
          };
        }
      }
      return item;
    });
  }

  static getDerivedStateFromProps(props, state) {
    // 初始化和每次setState都会触发此钩子函数：可以用于监听props
    const TC = RMCalendar;
    const newState = Object.assign({}, state);
    // 活动属性：date,type,firstDayOfWeek,schedule 活动属性变化会触发一系列内部更新
    const propsDate = JSON.stringify({
      year: props.date.getFullYear(),
      month: props.date.getMonth(),
      day: props.date.getDate()
    });
    const stateDate = JSON.stringify({
      year: state.date.getFullYear(),
      month: state.date.getMonth(),
      day: state.date.getDate()
    });
    if (propsDate !== stateDate) {
      // 对比时间：只精确到天，否则毫秒永远不相等
      // 触发 date 本身和 date 相关的 state 更新，以下相同
      newState.date = props.date;
      newState.weekRowIndex = TC.getWeekRowOfBoard(
        props.date,
        props.firstDayOfWeek
      );
      newState.dataOfBoard = TC.getComputedDataOfBoard(
        props.date,
        props.firstDayOfWeek,
        props.schedule
      );
      newState.selectDate = {
        year: props.date.getFullYear(),
        month: props.date.getMonth(),
        day: props.date.getDate()
      };
    }
    if (props.type !== state.type) {
      newState.type = props.type;
    }
    if (props.firstDayOfWeek !== state.firstDayOfWeek) {
      newState.firstDayOfWeek = props.firstDayOfWeek;
      newState.dataOfWeek = TC.getDataOfWeek(props.firstDayOfWeek);
      newState.weekRowIndex = TC.getWeekRowOfBoard(
        props.date,
        props.firstDayOfWeek
      );
      newState.dataOfBoard = TC.getComputedDataOfBoard(
        props.date,
        props.firstDayOfWeek,
        props.schedule
      );
    }
    if (props.schedule.toString() !== state.schedule.toString()) {
      // 对比数组：转化成字符串
      newState.schedule = props.schedule;
      newState.dataOfBoard = TC.getComputedDataOfBoard(
        props.date,
        props.firstDayOfWeek,
        props.schedule
      );
    }
    return newState;
  }

  _handleCellClick(item) {
    const TC = RMCalendar;
    this.setState((state, props) => {
      const { year, month, day } = item;
      const { year: _year, month: _month, day: _day } = state.selectDate;
      if (year !== _year || month !== _month || day !== _day) {
        const { onCellClick, firstDayOfWeek, schedule } = props;
        const newDate = new Date(year, month, day);
        if (onCellClick) onCellClick(item);
        return {
          weekRowIndex: TC.getWeekRowOfBoard(newDate, firstDayOfWeek),
          dataOfBoard: TC.getComputedDataOfBoard(
            newDate,
            firstDayOfWeek,
            schedule
          ),
          selectDate: { year, month, day }
        };
      }
    });
  }

  _handleResize() {
    const cellHeight = this.calendar.current.clientWidth / 7;
    this.setState(prevState => {
      if (prevState.cellHeight !== cellHeight) {
        return {
          cellHeight
        };
      }
      return null;
    });
  }

  render() {
    console.log(this.state);
    const { width, locale } = this.props; // 非活动的属性，内部状态不随props变化而更新
    const {
      type,
      dataOfWeek,
      dataOfBoard,
      weekRowIndex,
      selectDate,
      cellHeight
    } = this.state;
    const dateCellClassName = item =>
      cx('date-cell', {
        gray: item.monthIndex !== 0,
        dot: JSON.stringify(selectDate) !==
          JSON.stringify({
            year: item.year,
            month: item.month,
            day: item.day
          }) && !item.today && item.data
      });
    const dateCellClassNamePlus = item =>
      cx('selected', {
        today: item.today,
        dot: !item.today && item.data,
        'dot-white': item.today && item.data
      });
    return (
      <table
        ref={this.calendar}
        className={styles.container}
        cellSpacing="0"
        cellPadding="0"
        style={{ width: typeof width === 'number' ? `${width}px` : width }}>
        <thead>
          <tr>
            {Array.isArray(dataOfWeek) &&
              dataOfWeek.length > 0 &&
              dataOfWeek.map(item => (
                <td key={item.day}>{item[locale] || item['zh-cn']}</td>
              ))}
          </tr>
        </thead>
        <tbody>
          {type === 'month' &&
            new Array(6).fill('weekR-row').map((text, i) => (
              <tr key={`${text}-${i}`}>
                {dataOfBoard.slice(i * 7, (i + 1) * 7).map(item => (
                  <td
                    key={item.day}
                    title={`${item.year}-${item.month + 1}-${item.day}`}
                    onClick={() => this.handleCellClick(item)}>
                    <div
                      className={dateCellClassName(item)}
                      style={{
                        height: `${cellHeight}px`
                      }}>
                      {item.day}
                      {item.today && (
                        <i className={dateCellClassNamePlus(item)}>
                          {item.day}
                        </i>
                      )}
                      {JSON.stringify(selectDate) ===
                        JSON.stringify({
                          year: item.year,
                          month: item.month,
                          day: item.day
                        }) &&
                        !item.today && (
                        <i className={dateCellClassNamePlus(item)}>
                          {item.day}
                        </i>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          {type === 'week' && (
            <tr>
              {dataOfBoard
                .slice(weekRowIndex * 7, (weekRowIndex + 1) * 7)
                .map(item => (
                  <td
                    key={item.day}
                    title={`${item.year}-${item.month + 1}-${item.day}`}
                    onClick={() => this.handleCellClick(item)}>
                    <div
                      className={dateCellClassName(item)}
                      style={{
                        height: `${cellHeight}px`
                      }}>
                      {item.day}
                      {item.today && (
                        <i className={`${styles.selected} ${styles.today}`}>
                          {item.day}
                        </i>
                      )}
                      {JSON.stringify(selectDate) ===
                        JSON.stringify({
                          year: item.year,
                          month: item.month,
                          day: item.day
                        }) &&
                        !item.today && (
                        <i className={styles.selected}>{item.day}</i>
                      )}
                    </div>
                  </td>
                ))}
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }
}
