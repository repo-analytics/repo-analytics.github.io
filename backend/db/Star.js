/**
 * {
 *   repo: 'timqian/chart.xkcd',
 *   updatedAt: '2016-09-18',
 *   totalCount: '100',
 *   history: {
 *     '2018-04-12': 10,
 *   },
 *   locations: {
 *     china: 3,
 *   }
 * }
 */

const dynamodb = require('./dynamodb');

async function createTable() {
  console.log('going to create "repo-analytics-stars" table');
  await dynamodb.createTable({
    TableName: 'repo-analytics-stars',
    KeySchema: [
      { AttributeName: 'repo', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'repo', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    // ProvisionedThroughput: {
    //   ReadCapacityUnits: 1,
    //   WriteCapacityUnits: 1,
    // },
  }).promise();
  console.log('successfully created table "repo-analytics-stars"');
}

async function deleteTable() {
  await dynamodb.deleteTable({ TableName: 'repo-analytics-stars' }).promise();
}

async function get({ repo }) {
  const { Item } = await dynamodb.getItem({
    TableName: 'repo-analytics-stars',
    Key: {
      repo: { S: repo },
    },
  }).promise();
  return Item;
}

async function put({
  repo, updatedAt, totalCount, history, locations,
}) {
  await dynamodb.putItem({
    TableName: 'repo-analytics-stars',
    Item: {
      repo: { S: repo },
      updatedAt: { S: updatedAt },
      totalCount: { S: totalCount + '' },
      history: { S: JSON.stringify(history) },
      locations: { S: JSON.stringify(locations) },
    },
  }).promise();
}

module.exports = {
  createTable,
  deleteTable,
  get,
  put,
};

// // test
// (async () => {
//   // await createTable();
//   // await new Promise((r) => setTimeout(r, 1000));
//   await put({
//     repo: 'timqian/star-history',
//     updatedAt: '2019-03-01',
//     totalCount: 19,
//     history: {'2018-09-09': 2},
//     locations: {'china':1}
//   });
//   const item = await get({
//     repo: 'timqian/star-history',
//   });
//   console.log(item);
// })();
