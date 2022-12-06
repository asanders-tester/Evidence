// Get the artifacts produced by AWS
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const devicefarm = require('./devicefarm');
require('colors');

exports.getArtifacts = async (runArn) => {
    const downloadedArtifacts = [];
    // Check if directory exists
    const getRunResponse = await (devicefarm.getRun(runArn).catch(e => {
        console.error(e);
    }));
    const { name } = getRunResponse;
    const directory = path.join(__dirname, '..', '..', 'outputs', 'artifacts');
    try {
        fs.existsSync(directory);
        console.log(`Directory "${directory}" exists`.gray);
    } catch (err) {
        fs.mkdir(directory, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Directory created successfully!'.green);
            }
        });
    }

    // Create another level to the directory that includes the run's name
    const fileDir = path.join(directory, name);
    fs.mkdir(fileDir, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Directory created successfully!'.green);
        }
    });

    // Pull all of the logs
    const jobsResponse = await (devicefarm.listJobs(runArn).catch(e => {
        console.error(e);
    }));

    // Save the last run information
    for (const job of jobsResponse) {
        const jobArn = job.arn;

        // Get the job ARN
        console.log('Job ARN is', jobArn.cyan);

        // Get each suite within the job
        const suitesResponse = await (devicefarm.listSuites(jobArn).catch(e => {
            console.error(e);
        }));

        for (const suite of suitesResponse) {
            const suiteArn = suite.arn;

            // Get the suite ARN
            console.log('Suite ARN is', suiteArn.cyan);

            // Get each test within the suite
            const testsResponse = await (devicefarm.listTests(suiteArn).catch(e => {
                console.error(e);
            }));

            for (const test of testsResponse) {
                const testArn = test.arn;
                console.log('Test ARN is', testArn.cyan);

                // Get each artifact within the test
                for (const artifactType of ['FILE', 'SCREENSHOT', 'LOG']) {
                    const artifactsResponse = await (devicefarm.listArtifacts(testArn, artifactType).catch(e => {
                        console.error(e);
                    }));

                    for (const artifact of artifactsResponse) {
                        const { arn: artifactArn, name, type, extension, url } = artifact;
                        if (downloadedArtifacts.includes(artifactArn)) {
                            continue;
                        }
                        downloadedArtifacts.push(artifactArn);

                        console.log('Artifact ARN is', artifactArn.cyan);

                        const filename = `${type}_${name}.${extension}`;

                        console.log(`Downloading ${filename.blue} from ${name.blue}`);
                        const file = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        file.body.pipe(fs.createWriteStream(path.join(fileDir, filename)));
                        console.log('Done!'.green);
                    }
                }
            }
        }
    }
};
