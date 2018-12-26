import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import RMCalendar from '../../src'; // TODO: dev
// import RMCalendar from 'rm-calendar'; // TODO: test
import style from './App.less';

class App extends Component {
  render() {
    return (
      <div className={style.container}>
        <RMCalendar text="hello world!" />
      </div>
    );
  }
}

export default hot(module)(App);
