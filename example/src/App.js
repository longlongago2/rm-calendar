import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import RMCalendar from '../../src'; // TODO: dev
// import RMCalendar from '../../lib/rm-calendar'; // TODO: test
// import '../../lib/rm-calendar.css';
import style from './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'month',
      schedule: [
        {
          date: '2018-12-01',
          title: '班',
          content: [
            {
              text: '07:00-11:00',
            },
            {
              text: '14:00-18:00',
            },
          ],
        },
        {
          date: '2018-12-02',
          title: '休',
          content: [
            {
              text: '休息',
            },
          ],
        },
        {
          date: '2018-12-03',
          content: [
            {
              text: '日程提醒',
            },
          ],
        },
        {
          date: '2018-12-26',
          title: '休',
          content: [
            {
              text: '09:00-12:00',
            },
            {
              text: '13:30-18:00',
            },
          ],
        },
        {
          date: '2018-12-31',
          title: '班',
          content: [
            {
              text: '09:00-12:00',
            },
            {
              text: '13:30-18:00',
            },
          ],
        },
      ],
    };
    this.handleCellClick = this._handleCellClick.bind(this);
    this.handleModeChange = this._handleModeChange.bind(this);
    this.handleUpdateSchedule = this._handleUpdateSchedule.bind(this);
  }

  _handleCellClick(item) {
    const { mode } = this.state;
    console.log(item, mode);
  }

  _handleModeChange() {
    this.setState(state => ({
      mode: state.mode === 'month' ? 'week' : 'month',
    }));
  }

  _handleUpdateSchedule() {
    this.setState({
      schedule: [
        {
          date: '2018-12-29',
          title: '南京通道',
          content: [
            {
              text: '09:00-12:00',
            },
            {
              text: '13:30-18:00',
            },
          ],
        },
      ],
    });
  }

  render() {
    const { mode, schedule } = this.state;
    return (
      <div className={style.container}>
        <RMCalendar
          date={new Date()}
          touch
          type={mode}
          width="100%"
          locale="zh-cn"
          firstDayOfWeek={0}
          schedule={schedule}
          toolbar
          onCellClick={this.handleCellClick}
        />
        <p>
          <input
            type="button"
            value={`切换${mode === 'month' ? 'week' : 'month'}模式`}
            onClick={this.handleModeChange}
          />
        </p>
        <p>
          <input type="button" value="更新schedule" onClick={this.handleUpdateSchedule} />
        </p>
      </div>
    );
  }
}

export default hot(module)(App);
