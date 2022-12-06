// Initialize Device Farm

const AWS = require('aws-sdk');
const environment = require('../../../runner/utility/execution/environmentHandler');

const credentials = new AWS.Credentials(environment.dfAccessKey, environment.dfSecretKey, null);

AWS.config.update({
    credentials,
    region: environment.awsRegion
});
