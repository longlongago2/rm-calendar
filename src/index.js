import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './index.less';

export default class RMCalendar extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  static defaultProps = {
    text: 'example'
  };

  render() {
    const { text } = this.props;
    return <div className={style.container}>{text}</div>;
  }
}
