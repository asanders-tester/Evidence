/**
 * This file contains the calls to the Device Farm API.
 */


const AWS = require('aws-sdk');
const uploads = require('./createUploads');
const inputs = require('../../inputs/environment');
const { basename, identifier } = require('./utility');

exports.deviceFarm = new AWS.DeviceFarm({ apiVersion: '2015-06-23' });

const unique = identifier();

exports.putUpload = async (filename, type = undefined) => {
    const params = {
        name: unique + '_' + await basename(filename),
        type: type,
        projectArn: inputs.environment.awsConfig.projectArn,
        contentType: 'application/octet-stream'
    };
    const { upload } = await this.deviceFarm.createUpload(params).promise();
    return upload;
};

exports.deleteUpload = async () => {
    const params = {
        arn: await uploads.uploadFile()
    };
    const { upload } = await this.deviceFarm.deleteUpload(params).promise();
    return upload;
};

exports.getUpload = async (arn) => {
    const params = {
        arn: arn
    };
    const { upload } = await this.deviceFarm.getUpload(params).promise();
    return upload;
};

exports.listUploads = async (type) => {
    const params = {
        arn: inputs.environment.awsConfig.projectArn,
        type: type
    };
    const { uploads } = await this.deviceFarm.listUploads(params).promise();
    return uploads;
};

exports.postRun = async (appArn, testPackageArn, devicePoolArn, testSpecArn) => {
    const params = {
        appArn: appArn,
        name: unique,
        devicePoolArn: devicePoolArn,
        projectArn: inputs.environment.awsConfig.projectArn,
        test: {
            type: 'APPIUM_NODE',
            testPackageArn: testPackageArn,
            testSpecArn: testSpecArn
        }
    };
    const { run } = await this.deviceFarm.scheduleRun(params).promise();
    return run;
};

exports.deleteRun = async (runArn) => {
    const params = {
        arn: runArn
    };
    const { run } = await this.deviceFarm.deleteRun(params).promise();
    return run;
};

exports.getRun = async (runArn) => {
    const params = {
        arn: runArn
    };
    const { run } = await this.deviceFarm.getRun(params).promise();
    return run;
};

exports.listRuns = async () => {
    const params = {
        arn: inputs.environment.awsConfig.projectArn
    };
    const { runs } = await this.deviceFarm.listRuns(params).promise();
    return runs;
};

exports.stopRun = async (runArn) => {
    const params = {
        arn: runArn
    };
    const { run } = await this.deviceFarm.stopRun(params).promise();
    return run;
};

exports.getJob = async (jobArn) => {
    const params = {
        arn: jobArn
    };
    const { job } = await this.deviceFarm.getJob(params).promise();
    return job;
};

exports.listJobs = async (runArn) => {
    const params = {
        arn: runArn
    };
    const { jobs } = await this.deviceFarm.listJobs(params).promise();
    return jobs;
};

exports.getSuite = async (suiteArn) => {
    const params = {
        arn: suiteArn
    };
    const { suite } = await this.deviceFarm.getSuite(params).promise();
    return suite;
};

exports.listSuites = async (jobArn) => {
    const params = {
        arn: jobArn
    };
    const { suites } = await this.deviceFarm.listSuites(params).promise();
    return suites;
};

exports.getTest = async (testArn) => {
    const params = {
        arn: testArn
    };
    const { test } = await this.deviceFarm.getTest(params).promise();
    return test;
};

exports.listTests = async (suiteArn) => {
    const params = {
        arn: suiteArn
    };
    const { tests } = await this.deviceFarm.listTests(params).promise();
    return tests;
};

exports.listArtifacts = async (testArn, type) => {
    const params = {
        arn: testArn,
        type: type
    };
    const { artifacts } = await this.deviceFarm.listArtifacts(params).promise();
    return artifacts;
};
