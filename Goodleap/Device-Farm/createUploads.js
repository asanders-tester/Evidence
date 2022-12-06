// Upload the necessary files to AWS Device Farm
const fs = require('fs');
const devicefarm = require('./devicefarm');
const fetch = require('node-fetch');
const colors = require('colors');

function statusColor(str) {
    if (!colors.enabled) {
        return str + '';
    }

    switch (str) {
    case 'FAILED':
        return str.red;
    case 'INITIALIZED':
    case 'PROCESSING':
        return str.yellow;
    case 'SUCCEEDED':
        return str.green;
    default:
        return str + '';
    }
}

// Invoke the API to save the data
exports.uploadFile = async (filename, type) => {
    const uploadResponse = await (devicefarm.putUpload(filename, type).catch(e => {
        console.error(e);
    }));
    const { status, name, arn: uploadArn, url } = uploadResponse;

    if (!fs.existsSync(filename)) {
        console.log(filename.blue + ' does not exist'.red);
        return uploadArn;
    }

    // Get a timestamp for when the upload was started
    const started = new Date().toLocaleString();

    // Determine the state of the request
    console.log(`Upload of ${name.blue} in state ${statusColor(status)} @ ${started.blue}`);

    const put = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        body: fs.readFileSync(filename)
    });

    if (put.ok) {
        console.log(`Uploaded ${filename.blue} to ${uploadArn.cyan} as ${name.blue}.`);
    } else {
        console.log('Failed to upload '.red + filename.blue + ' to '.red + uploadArn.cyan + ' as '.red + name.blue + '.'.red);
        console.log(`${put.status} ${put.statusText}`.red);
    }

    // Check state of upload before continuing
    let getStatus = status;
    while (getStatus === 'INITIALIZED' || getStatus === 'PROCESSING') {
        const getUploadResponse = await (devicefarm.getUpload(uploadArn).catch(e => {
            console.error(e);
        }));
        const { status } = getUploadResponse;

        // Get the current status
        const now = new Date().toLocaleString();
        console.log(`State is now ${statusColor(status)} @ ${now.blue}`);
        getStatus = status;
    }
    const now = new Date().toLocaleString();
    console.log(`Upload ${name.blue} is finished in state ${statusColor(getStatus)} @ ${now.blue}`);
    return uploadArn;
};
