const inputs = require('../../inputs/environment');
require('colors');

// Create a formatted time stamp
const formatTimestamp = (timestamp) => {
    let formattedTimestamp = timestamp.replace(/:/g, '-');
    formattedTimestamp = formattedTimestamp.replace(/\./g, '_');
    return formattedTimestamp;
};

// Create a unique identifier using the formatted time stamp
exports.identifier = () => {
    const runTimestamp = new Date().toISOString();
    const runTimestampFormatted = formatTimestamp(runTimestamp);
    const random = Array(4).fill(null).map(() => Math.random().toString(36).substr(2)).join('');
    const unique = inputs.environment.awsConfig.namePrefix + '-' + runTimestampFormatted + '-' + random;
    console.log(`The unique identifier for this run is going to be "${unique.blue}" -- all uploads will be prefixed with this.`);
    return unique;
};

// Extract the file name from the full path
exports.basename = async function(path) {
    return await path.split('/').reverse()[0];
};

exports.wait = (time) => {
    return new Promise((res) => {
        setTimeout(res, time);
    });
};
