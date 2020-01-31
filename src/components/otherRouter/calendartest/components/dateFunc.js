import moment from 'moment';

let dateFunc = {
  getMonthViewStartDate (date, firstDay) { // 当前日历第一周对应的日期
    firstDay = parseInt(firstDay);
    let start = moment(date);
    let startOfMonth = moment(start.startOf('month'));

    start.subtract(startOfMonth.day(), 'days');

    if (startOfMonth.day() < firstDay) {
      start.subtract(7, 'days');
    }

    start.add(firstDay, 'days');

    return start;
  },
  getMonthViewEndDate (date) { //当前日历最后一会走周日对应的日期
    return this.getMonthViewStartDate().add(6, 'weeks');
  }
};

export default dateFunc;
