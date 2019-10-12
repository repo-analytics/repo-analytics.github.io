const dayjs = require('dayjs');
/**
 * @param {String} earliestDate
 * @param {String} latestDate
 * @return {Array} date array
 * 
 * @example
 *   // ['2019-03-19', '2019-04-02', ..., '2019-10-01']
 *   func('2019-03-19', '2019-10-10')
 */
function func(earliestDate, latestDate) {
  const earliestDay = dayjs(earliestDate);
  const latestDay = dayjs(latestDate);
  const daysCount = latestDay.diff(earliestDay, 'day');

  if (daysCount <= 0) return undefined;

  let daysToGet = [earliestDay.format('YYYY-MM-DD')];
  if (daysCount > 14) {
    let curDay = earliestDay.add(14, 'days');
    while (curDay.isBefore(latestDay)) {
      daysToGet.push(curDay.format('YYYY-MM-DD'));
      curDay = curDay.add(14, 'days');
    }
  }

  return daysToGet;
}

module.exports = func;

// // test
// console.log(func('2019-03-19', '2019-10-10'));
// console.log(func('2019-10-08', '2019-10-10'));
// console.log(func('2019-10-01', '2019-10-10'));