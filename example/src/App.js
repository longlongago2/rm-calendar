import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import RMCalendar from '../../src'; // TODO: dev
// import RMCalendar from '../../lib/rm-calendar'; // TODO: test
// import '../../lib/rm-calendar.css';
import { prefixInteger } from './utils';
import styles from './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData: '',
      schedule: [],
    };
    this.handleCellClick = this._handleCellClick.bind(this);
    this.handlePageChange = this._handlePageChange.bind(this);
  }

  _handleCellClick(item) {
    console.log(item);
    this.setState({ selectData: item });
  }

  _handlePageChange(dateObj) {
    this.setState({
      schedule: [
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-01`,
          title: '休',
          schedule: [
            {
              text: '09:00-12:00：参加一个重要会议',
            },
            {
              text: '13:30-18:00：陪领导视察',
            },
          ],
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-02`,
          title: '班',
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-03`,
          title: '班',
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-04`,
          title: '班',
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-05`,
          title: '班',
          schedule: [
            {
              text: '小明明天结婚',
            },
            {
              text: '小张今天晚上生日请客',
            },
          ],
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-06`,
          title: '班',
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-07`,
          title: '班',
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-08`,
          title: '班',
        },
        {
          date: `${dateObj.year}-${prefixInteger(dateObj.month + 1)}-09`,
          title: '休',
        },
      ],
    });
  }

  render() {
    const { schedule, selectData } = this.state;
    return (
      <div className={styles.container}>
        <RMCalendar
          defaultDate={new Date()}
          type="month"
          touch
          width="100%"
          locale="zh-cn"
          firstDayOfWeek={0}
          schedule={schedule}
          toolbar
          onCellClick={this.handleCellClick}
          onPageChange={this.handlePageChange}
        />
        {selectData.data && selectData.data.schedule && (
          <div className={styles.schedule}>
            <div>{`${selectData.year} 年 ${selectData.month + 1} 月 ${selectData.day} 日，日程安排：`}</div>
            {Array.isArray(selectData.data.schedule)
              && selectData.data.schedule.length > 0
              && selectData.data.schedule.map(item => <div key={item.text}>{item.text}</div>)}
          </div>
        )}
      </div>
    );
  }
}

export default hot(module)(App);
