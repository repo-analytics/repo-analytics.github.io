function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

module.exports = getUniqueListBy;

// // test
// const res = getUniqueListBy([ { timestamp: '2019-09-27T00:00:00Z', count: 586, uniques: 352 },
// { timestamp: '2019-09-28T00:00:00Z', count: 175, uniques: 121 },
// { timestamp: '2019-09-29T00:00:00Z', count: 405, uniques: 251 },
// { timestamp: '2019-09-30T00:00:00Z', count: 322, uniques: 182 },
// { timestamp: '2019-10-01T00:00:00Z', count: 94, uniques: 58 },
// { timestamp: '2019-10-02T00:00:00Z', count: 152, uniques: 99 },
// { timestamp: '2019-10-03T00:00:00Z', count: 166, uniques: 91 },
// { timestamp: '2019-10-04T00:00:00Z', count: 83, uniques: 56 },
// { timestamp: '2019-10-05T00:00:00Z', count: 39, uniques: 31 },
// { timestamp: '2019-10-06T00:00:00Z', count: 92, uniques: 43 },
// { timestamp: '2019-10-07T00:00:00Z', count: 200, uniques: 96 },
// { timestamp: '2019-10-08T00:00:00Z', count: 255, uniques: 135 },
// { timestamp: '2019-10-09T00:00:00Z', count: 405, uniques: 161 },
// { timestamp: '2019-10-10T00:00:00Z', count: 236, uniques: 120 },
// { timestamp: '2019-09-27T00:00:00Z', count: 586, uniques: 352 },
// { timestamp: '2019-09-28T00:00:00Z', count: 175, uniques: 121 },
// { timestamp: '2019-09-29T00:00:00Z', count: 405, uniques: 251 },
// { timestamp: '2019-09-30T00:00:00Z', count: 322, uniques: 182 },
// { timestamp: '2019-10-01T00:00:00Z', count: 94, uniques: 58 },
// { timestamp: '2019-10-02T00:00:00Z', count: 152, uniques: 99 },
// { timestamp: '2019-10-03T00:00:00Z', count: 166, uniques: 91 },
// { timestamp: '2019-10-04T00:00:00Z', count: 83, uniques: 56 },
// { timestamp: '2019-10-05T00:00:00Z', count: 39, uniques: 31 },
// { timestamp: '2019-10-06T00:00:00Z', count: 92, uniques: 43 },
// { timestamp: '2019-10-07T00:00:00Z', count: 200, uniques: 96 },
// { timestamp: '2019-10-08T00:00:00Z', count: 255, uniques: 135 },
// { timestamp: '2019-10-09T00:00:00Z', count: 405, uniques: 161 },
// { timestamp: '2019-10-10T00:00:00Z', count: 236, uniques: 120 } ], 'timestamp');

// console.log(res);