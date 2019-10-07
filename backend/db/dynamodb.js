const fs = require('fs');
const AWS = require('aws-sdk');

const config = require('../secret.json');

const awsConfig = {
  region: 'us-east-1',
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  signatureVersion: 'v4',
};

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB();

module.exports = dynamodb;
