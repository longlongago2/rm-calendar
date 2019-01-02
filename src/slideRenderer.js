import React from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
import styles from './index.less';

const cx = classNames.bind(styles);

export default function slideRenderer(slide, that, RMCalendar) {
  const { key } = slide;
  const {
    width, locale, firstDayOfWeek, toolbar,
  } = that.props; // 非活动的属性，内部状态不随props变化而更新
  const {
    type,
    dataOfHeader,
    dataOfBoard,
    weekRowIndex,
    selectDate,
    cellHeight,
    dropdownlist,
  } = that.state;
  const styleCellBody = (item) => {
    const itemDate = {
      year: item.year,
      month: item.month,
      day: item.day,
    };
    return cx('circle', {
      today: item.today,
      gray: item.monthIndex !== 0,
      selected: JSON.stringify(selectDate) === JSON.stringify(itemDate) && !item.today,
      'today-selected': JSON.stringify(selectDate) === JSON.stringify(itemDate) && item.today,
      dot: item.data,
    });
  };
  const selectDateTime = new Date(selectDate.year, selectDate.month, selectDate.day);
  return (
    <div key={key}>
      {toolbar && (
        <div className={styles['top-bar']}>
          <div className={styles.date}>
            <div
              className={styles['opt-btn']}
              role="button"
              tabIndex="0"
              onClick={() => that.setState(state => ({ dropdownlist: !state.dropdownlist }))}
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
                  disabled: selectDate.year <= 1900 && selectDate.month === 0,
                })}
                role="button"
                tabIndex="-5"
                onClick={() => that.handleChangeBoard(-1)}
              />
              <div
                className={cx('btn', 'up', {
                  disabled: selectDate.year >= 2099 && selectDate.month === 11,
                })}
                role="button"
                tabIndex="-6"
                onClick={() => that.handleChangeBoard(1)}
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
                onClick={() => that.handleChangeType('month')}
              >
                <i className={cx({ selected: type === 'month' })}>M</i>
                月视图
              </div>
              <div
                className={styles.opt}
                role="button"
                tabIndex="-4"
                onClick={() => that.handleChangeType('week')}
              >
                <i className={cx({ selected: type === 'week' })}>W</i>
                周视图
              </div>
            </div>
          )}
        </div>
      )}
      <table
        ref={that.calendar}
        className={styles.container}
        cellSpacing="0"
        cellPadding="5"
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
      >
        <thead>
          <tr>
            {Array.isArray(dataOfHeader)
              && dataOfHeader.length > 0
              && dataOfHeader.map(item => <td key={item.day}>{item[locale] || item['zh-cn']}</td>)}
          </tr>
        </thead>
        <tbody>
          {type === 'month'
            && [0, 1, 2, 3, 4, 5].map((row, i) => (
              <tr key={row}>
                {dataOfBoard.slice(i * 7, (i + 1) * 7).map(item => (
                  <td key={item.day || Math.random()} onClick={() => that.handleCellClick(item)}>
                    {item && (
                      <div
                        className={styles.cell}
                        style={{
                          height: `${cellHeight}px`,
                        }}
                      >
                        <div className={styleCellBody(item)}>
                          {item.day}
                          {item.data && item.data.title && (
                            <span className={styles.title}>{item.data.title}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          {type === 'week' && (
            <tr>
              {dataOfBoard.slice(weekRowIndex * 7, (weekRowIndex + 1) * 7).map(item => (
                <td key={item.day || Math.random()} onClick={() => that.handleCellClick(item)}>
                  {item && (
                    <div
                      className={styles.cell}
                      style={{
                        height: `${cellHeight}px`,
                      }}
                    >
                      <div className={styleCellBody(item)}>
                        {item.day}
                        {item.data && item.data.title && (
                          <span className={styles.title}>{item.data.title}</span>
                        )}
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
