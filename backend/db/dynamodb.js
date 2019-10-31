const AWS = require('aws-sdk');

let config = {};

try {
  config = require('../secret.json');
} catch (error) {
  console.log('no secret json, on github action')
}

const awsConfig = {
  region: 'us-east-1',
  // process.env.awsAccessKeyId in action secret
  accessKeyId: process.env.awsAccessKeyId ? process.env.awsAccessKeyId : config.aws.accessKeyId,
  secretAccessKey: process.env.awsSecretAccessKey ? process.env.awsSecretAccessKey : config.aws.secretAccessKey,
  signatureVersion: 'v4',
};

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB();

module.exports = dynamodb;
