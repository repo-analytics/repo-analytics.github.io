/**
 * {
 *   repo: 'timqian/chart.xkcd',
 *   date: '2016-09-18',
 *   views: [],
 *   clones: [],
 *   referrers: [],
 *   paths: [],
 *   repoCreatedAt: '2019-10-08'
 * }
 */

const dynamodb = require('./dynamodb');

async function createTable() {
  console.log('going to create "repo-analytics-analytics" table');
  await dynamodb.createTable({
    TableName: 'repo-analytics-analytics',
    KeySchema: [
      { AttributeName: 'repo', KeyType: 'HASH' },
      { AttributeName: 'date', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'repo', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    // ProvisionedThroughput: {
    //   ReadCapacityUnits: 1,
    //   WriteCapacityUnits: 1,
    // },
  }).promise();
  console.log('successfully created table "repo-analytics-analytics"');
}

async function deleteTable() {
  await dynamodb.deleteTable({ TableName: 'repo-analytics-analytics' }).promise();
}

async function batchGetViewAndClones({ repo, dateArr }) {
  const keys = dateArr.map(date => ({
    repo: { S: repo },
    date: { S: date }
  }));

  const { Responses } = await dynamodb.batchGetItem({
    RequestItems: {
      "repo-analytics-analytics": {
        Keys: keys,
        AttributesToGet: [
          'repo',
          'date',
          'views',
          'clones',
        ],
      }
    }
  }).promise();
  return Responses["repo-analytics-analytics"];
}

async function getLatest({ repo }) {
  const { Items } = await dynamodb.query({
    TableName: 'repo-analytics-analytics',
    KeyConditionExpression: 'repo = :repo',
    ExpressionAttributeValues: {
      ':repo': { S: repo },
    },
    Limit: 1,
    ScanIndexForward: false,
  }).promise();
  return Items[0];
}

async function put({
  repo, date, views, clones, referrers, paths, repoCreatedAt,
}) {
  await dynamodb.putItem({
    TableName: 'repo-analytics-analytics',
    Item: {
      repo: { S: repo },
      date: { S: date },
      views: { S: JSON.stringify(views) },
      clones: { S: JSON.stringify(clones) },
      referrers: { S: JSON.stringify(referrers) },
      paths: { S: JSON.stringify(paths) },
      createdAt: { S: new Date().toISOString() },
      repoCreatedAt: { S: repoCreatedAt }
    },
  }).promise();
}

module.exports = {
  createTable,
  deleteTable,
  getLatest,
  batchGetViewAndClones,
  put,
};


// // test
// (async () => {
//   // await createTable();
//   // await new Promise((r) => setTimeout(r, 1000));
//   // await put({
//   //   repo: 'timqian/chart.xkcd',
//   //   date: '2019-10-09',
//   //   views: [
//   //     {
//   //       "timestamp": "2016-10-10T00:00:00Z",
//   //       "count": 440,
//   //       "uniques": 143
//   //     },
//   //     {
//   //       "timestamp": "2016-10-11T00:00:00Z",
//   //       "count": 1308,
//   //       "uniques": 414
//   //     },
//   //   ],
//   //   referrers: [
//   //     {
//   //       "referrer": "Google",
//   //       "count": 4,
//   //       "uniques": 3
//   //     },
//   //     {
//   //       "referrer": "stackoverflow.com",
//   //       "count": 2,
//   //       "uniques": 2
//   //     }
//   //   ],
//   //   paths: [
//   //     {
//   //       "path": "/github/hubot",
//   //       "title": "github/hubot: A customizable life embetterment robot.",
//   //       "count": 3542,
//   //       "uniques": 2225
//   //     },
//   //     {
//   //       "path": "/github/hubot/blob/master/docs/scripting.md",
//   //       "title": "hubot/scripting.md at master · github/hubot · GitHub",
//   //       "count": 1707,
//   //       "uniques": 804
//   //     }
//   //   ],
//   //   clones: [
//   //     {
//   //       "timestamp": "2016-10-10T00:00:00Z",
//   //       "count": 2,
//   //       "uniques": 1
//   //     },
//   //     {
//   //       "timestamp": "2016-10-11T00:00:00Z",
//   //       "count": 17,
//   //       "uniques": 16
//   //     }
//   //   ]
//   //   repoCreatedAt: '2018-09-10'
//   // });

//   // const item = await batchGet({ repo: 'timqian/chart.xkcd', dateArr: ['2019-10-09']})

//   // console.log(item);

//   // const latestItem = await getLatest({ repo: 'timqian/chart.xkcd' });
//   // console.log(latestItem)
// })();
