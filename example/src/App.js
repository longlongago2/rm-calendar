import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import RMCalendar from '../../src'; // TODO: dev
// import RMCalendar from 'rm-calendar'; // TODO: test
import style from './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'month',
      schedule: [
        {
          date: '2018-12-01',
          title: '送货通道',
          content: [
            {
              text: '07:00-11:00'
            },
            {
              text: '14:00-18:00'
            }
          ]
        },
        {
          date: '2018-12-02',
          title: '发货通道',
          content: [
            {
              text: '休息'
            }
          ]
        },
        {
          date: '2018-12-29',
          title: '南京大区通道',
          content: [
            {
              text: '09:00-12:00'
            },
            {
              text: '13:30-18:00'
            }
          ]
        },
        {
          date: '2018-12-30',
          title: '南京通道',
          content: [
            {
              text: '09:00-12:00'
            },
            {
              text: '13:30-18:00'
            }
          ]
        }
      ]
    };
    this.handleCellClick = this._handleCellClick.bind(this);
    this.handleModeChange = this._handleModeChange.bind(this);
  }
  _handleCellClick(item) {
    console.log(item);
  }
  _handleModeChange() {
    this.setState(state => ({
      mode: state.mode === 'month' ? 'week' : 'month'
    }));
  }
  render() {
    const { mode } = this.state;
    return (
      <div className={style.container}>
        <input
          type="button"
          value={`切换${mode === 'month' ? 'week' : 'month'}模式`}
          onClick={this.handleModeChange}
        />
        <RMCalendar
          date={new Date(2018, 11, 30)}
          type={this.state.mode}
          width="100%"
          locale="zh-cn"
          firstDayOfWeek={0}
          schedule={this.state.schedule}
          onCellClick={this.handleCellClick}
        />
      </div>
    );
  }
}

export default hot(module)(App);
