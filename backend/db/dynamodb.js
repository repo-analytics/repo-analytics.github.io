const fs = require('fs');
const AWS = require('aws-sdk');

const config = require('../secret.json');

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
