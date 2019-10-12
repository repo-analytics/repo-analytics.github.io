/**
 * {
 *   username: 'timqian',
 *   repo: 'timqian/chart.xkcd',
 *   createdAt: '',
 * }
 */
const dynamodb = require('./dynamodb');

// TODO: secondary index for repo - to get repo's 'createdAt'
async function createTable() {
  console.log('going to create "repo-analytics-repo" table');
  await dynamodb.createTable({
    TableName: 'repo-analytics-repo',
    KeySchema: [
      { AttributeName: 'username', KeyType: 'HASH' },
      { AttributeName: 'repo', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'username', AttributeType: 'S' },
      { AttributeName: 'repo', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    // ProvisionedThroughput: {
    //   ReadCapacityUnits: 1,
    //   WriteCapacityUnits: 1,
    // },
  }).promise();
  console.log('successfully created table "repo-analytics-repo"');
}

async function deleteTable() {
  await dynamodb.deleteTable({ TableName: 'repo-analytics-repo' }).promise();
}

async function getAllForUser({ username }) {
  const { Items } = await dynamodb.query({
    TableName: 'repo-analytics-repo',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': { S: username },
    },
  }).promise();
  return Items;
}

async function put({
  username, repo,
}) {
  await dynamodb.putItem({
    TableName: 'repo-analytics-repo',
    Item: {
      username: { S: username },
      repo: { S: repo },
      createdAt: { S: new Date().toISOString() },
    },
  }).promise();
}

async function scan() {
  const data = await dynamodb.scan({
    TableName: 'repo-analytics-repo',
    AttributesToGet: [
      'username',
      'repo',
      'createdAt',
    ],
  }).promise();

  // FIXME: if repo data larger than 1MB data, we need to handle pagination
  return data.Items;
}

module.exports = {
  createTable,
  deleteTable,
  getAllForUser,
  put,
  scan,
};


// // test
// (async () => {
//   // await createTable();
//   // await new Promise((r) => setTimeout(r, 1000));
//   await put({
//     username: 'timqian',
//     repo: 'repo-analytics/repo-analytics.github.io',
//   });
//   // const items = await getAllForUser({
//   //   username: 'timqian',
//   // });
//   // console.log(items);
//   const scanRes = await scan();
//   console.log(scanRes)
// })();
