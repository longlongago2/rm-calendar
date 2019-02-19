# rm-calendar

> react mobile calendar

![gif](./screenshot/GIF.gif)

## NPM

#### install

`npm install @longlongago2/rm_calendar --save`

#### usage

```
import React, { Component } from 'react';
import RMCalendar from '@longlongago2/rm-calendar';
import '@longlongago2/rm_calendar/dist/rm-calendar.css';

class App extends Component {
  render() {
    return (
      <RMCalendar
          defaultDate={new Date()}
          type="month"
          touch
          width="100%"
          locale="zh-cn"
          firstDayOfWeek={0}
          toolbar
        />
    );
  }
}
```

## CDN

#### download

[rm-calendar.zip (click to download)](https://github.com/longlongago2/rm-calendar/archive/master.zip)

#### usage

```
// css
<link rel="stylesheet" href="[path]/dist/rm-calendar.css">

// js
<script src="[path]/dist/rm-calendar.js"></script>

// html
<RMCalendar.default
    defaultDate={new Date()}
    type="month"
    touch
    width="100%"
    locale="zh-cn"
    firstDayOfWeek={0}
    toolbar
  />
```

## API

#### props
| Props | Description | Type | Default |
| :------ | :------ | :------: | :------: |
| defaultDate | 默认时间 | Date | new Date() |
| type | 日历类型 | "month"\|"week" | "month" |
| touch | 是否可滑动 | Boolen | true |
| width | 日历宽度 | String | "100%" |
| locale | 语言区 | String | "zh-cn" |
| firstDayOfWeek | 周起始日[周日-周六] | [0-6] | 0 |
| schedule | 日程数据 | Array | [] |
| toolbar | 顶部工具栏 | Boolen | true |

#### events

| Events | Description | Usage |
| :------ | :------ | :------: |
| onCellClick | 日期单元格点击事件 | (item) => {} |
| onPageChange | 翻页事件 | ({ year, month }) => {} |

#### methods

| Methods | Description | Params |
| :------ | :------ | :------: |
| turnWeekNumToChar | 周数字转汉字，参数：0-6 | day :Integer |
| getDaysOfPerMonth | 获取每个月的天数，参数：日期 | date :Date |
| getDataOfHeader | 获取表头周数据， 参数：周起始日(0-6) | firstDayOfWeek: Number |
| getComposeDaysOfBoard | 获取面板组成天数据，参数1：date日期，参数2：周起始日，参数3：查询部分[-1：获取上月组成天数, 0：获取本月组成天数, 1：获取下月组成天数] | date: Date, firstDayOfWeek: Number, order: Number |
| getDataOfBoard | 获取面板所有日期数据，参数1：日期，参数2：周起始日 | date: Date, firstDayOfWeek: Number |
| getWeekRowOfBoard | 获取日期所在面板中的行数，参数1：日期，参数2：周起始日 | date: Date, firstDayOfWeek: Number |
| getComputedDataOfBoard | 获取合成日程表数据的日期面板数据，参数1：日期，参数2：周起始日期，日程表数据 | date: Date, firstDayOfWeek: Number, schedule: Array |
| dateToValid | 校正日期1900-2099，大于或小于正常数据范围自动纠正 | date: Date |
