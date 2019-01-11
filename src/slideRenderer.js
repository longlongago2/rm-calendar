import React from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
import styles from './index.less';

const cx = classNames.bind(styles);

export function goDateBoard(go, that, RMCalendar) {
  if (go === undefined || that === undefined) return false;
  const { type, date } = that.state;
  const { firstDayOfWeek, schedule } = that.props;
  const currentMoment = moment(date);
  let goMoment = currentMoment;
  if (type === 'month') {
    // 切换下月
    if (go > 0) {
      goMoment = currentMoment.add(Number(go), 'months');
    }
    if (go < 0) {
      goMoment = currentMoment.subtract(Number(-go), 'months');
    }
  }
  if (type === 'week') {
    // 切换下周
    if (go > 0) {
      goMoment = currentMoment.add(Number(go), 'weeks');
    }
    if (go < 0) {
      goMoment = currentMoment.subtract(Number(-go), 'weeks');
    }
  }
  const goDate = {
    year: goMoment.get('year'),
    month: goMoment.get('month'),
    day: goMoment.get('date'),
  };
  if (RMCalendar === undefined) {
    return {
      selectDate: goDate,
    };
  }
  // 默认值
  if (go === 0) {
    return {
      dataOfBoard: RMCalendar.getComputedDataOfBoard(date, firstDayOfWeek, schedule),
      selectDate: {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
      },
      weekRowIndex: RMCalendar.getWeekRowOfBoard(date, firstDayOfWeek),
    };
  }
  // 切换面板之后的值
  const newDate = new Date(goDate.year, goDate.month, goDate.day);
  return {
    dataOfBoard: RMCalendar.getComputedDataOfBoard(newDate, firstDayOfWeek, schedule),
    selectDate: goDate,
    weekRowIndex: RMCalendar.getWeekRowOfBoard(newDate, firstDayOfWeek),
  };
}

export default function slideRenderer(slide, that, RMCalendar) {
  const { key, index } = slide;
  const { width, locale, firstDayOfWeek } = that.props; // 非活动的属性，内部状态不随props变化而更新
  const { type, cellHeight, selectDate } = that.state;
  const dataOfHeader = RMCalendar.getDataOfHeader(firstDayOfWeek);
  const { dataOfBoard, weekRowIndex } = goDateBoard(index, that, RMCalendar); // 根据索引计算面板数据
  const styleCellBody = (item) => {
    const itemDate = {
      year: item.year,
      month: item.month,
      day: item.day,
    };
    return cx('circle', {
      today: item.today, // 当天日期
      gray: item.monthIndex !== 0, // 置灰
      selected: JSON.stringify(selectDate) === JSON.stringify(itemDate) && !item.today, // 非当天日期选中
      selective: JSON.stringify(selectDate) === JSON.stringify(itemDate) && item.today, // 当天日期选中
      dot: item.data && item.data.schedule,
    });
  };
  return (
    <table
      key={key}
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
                <td
                  key={item.day || Math.random()}
                  onClick={() => that.handleCellClick(item)}
                  title={`${item.year}-${item.month + 1}-${item.day}`}
                >
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
              <td
                key={item.day || Math.random()}
                onClick={() => that.handleCellClick(item)}
                title={`${item.year}-${item.month + 1}-${item.day}`}
              >
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
  );
}
