# rm-calendar

> react mobile calendar

## NPM

#### install

`npm install rm-calendar --save`

#### usage

```
import RMCalendar from 'rm-calendar';

class App extends React.Component {
  render() {
    return (
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
    schedule={schedule}
    toolbar
    onCellClick={this.handleCellClick}
    onPageChange={this.handlePageChange}
  />
```
