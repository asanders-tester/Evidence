// Schedule a run in AWS Device Farm
const devicefarm = require('./devicefarm');
const util = require('./utility');
const colors = require('colors');

function statusColor(str) {
    if (!colors.enabled) {
        return str + '';
    }

    switch (str) {
    case 'PENDING':
    case 'PENDING_CONCURRENCY':
    case 'PENDING_DEVICE':
    case 'PROCESSING':
    case 'SCHEDULING':
        return str.yellow;
    case 'PREPARING':
    case 'RUNNING':
    case 'COMPLETED':
        return str.green;
    case 'STOPPING':
        return str.red;
    default:
        return str + '';
    }
}

function resultColor(str) {
    if (!colors.enabled) {
        return str + '';
    }

    switch (str) {
    case 'PENDING':
    case 'WARNED':
    case 'SKIPPED':
        return str.yellow;
    case 'PASSED':
        return str.green;
    case 'FAILED':
    case 'ERRORED':
    case 'STOPPED':
        return str.red;
    default:
        return str + '';
    }
}

// Invoke the API to save the data
exports.scheduleRun = async (appArn, testPackageArn, devicePoolArn, testSpecArn) => {
    const scheduleResponse = await (devicefarm.postRun(appArn, testPackageArn, devicePoolArn, testSpecArn).catch(e => {
        console.error(e);
    }));
    const { status, name, arn, result } = scheduleResponse;

    // Get a time stamp for when the run was started
    const started = new Date().toLocaleString();

    // Determine the state of the request
    console.log(`Run ${name.blue} is scheduled as ${arn.cyan} in state ${statusColor(status)} @ ${started.blue}`);

    // Check state of run before continuing
    let getStatus = status;
    let getResult = result;

    while (true) {
        if (getStatus === 'SCHEDULING' || getStatus === 'RUNNING') {
            console.log('Waiting for 3 minutes...'.gray);
            await util.wait(180000);
            const getRunResponse = await (devicefarm.getRun(arn).catch(e => {
                console.error(e);
            }));
            const { status } = getRunResponse;

            // Get the current status
            const now = new Date().toLocaleString();
            console.log(`State is now ${statusColor(status)} @ ${now.blue}`);
            getStatus = status;

        // Stop the run if there is a problem
        } else if (getStatus === 'COMPLETED') {
            const now = new Date().toLocaleString();
            console.log(`Run ${name.blue} is finished in state ${statusColor(getStatus)} @ ${now.blue}`);
            break;
        } else if (getStatus === 'ERRORED') {
            const now = new Date().toLocaleString().blue;
            const runResponse = await (devicefarm.stopRun(arn).catch(e => {
                console.error(e);
            }));
            const { status, name } = runResponse;
            console.log(`Run ${name.blue} is finished in state ${statusColor(status)} @ ${now.blue}`);
            break;
        }
    }

    if (getResult === 'PENDING') {
        console.log(`Test result is ${resultColor(getResult)}`);
        const newRunResponse = await (devicefarm.getRun(arn).catch(e => {
            console.error(e);
        }));
        const { result } = newRunResponse;
        console.log(`Test result is now ${resultColor(result)}`);
        getResult = result;
    } else {
        console.log(`Test result is ${resultColor(result)}`);
    }

    return arn;
};
