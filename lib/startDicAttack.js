const makeAndLogReq = require('./makeAndLogReq');
const parallelPromises = require('../util/parallelPromises');

const REQUESTS_STATS = {
    counter: 0,
    min: null,
    max: null,
    midRange: null,
    founds: 0
};

function onResponse(erroredResult, foundResult, options) {
    const {targetPath, listLen, logger} = options;
    const {target, ms, res, err} = foundResult || erroredResult;
    if (REQUESTS_STATS.counter % 10) {
        REQUESTS_STATS.min = (ms <= REQUESTS_STATS.min) ? ms : REQUESTS_STATS.min;
        REQUESTS_STATS.max = (ms > REQUESTS_STATS.max) ? ms : REQUESTS_STATS.max;
    } else {
        REQUESTS_STATS.midRange = (REQUESTS_STATS.min + REQUESTS_STATS.max) / 2;
    }
    REQUESTS_STATS.counter++;

    const percent = REQUESTS_STATS.counter / listLen * 100;
    logger.overwriteLastLine(percent.toFixed(0) + '%'
        + '\t' + REQUESTS_STATS.counter + '/' + listLen
        + '\t' + 'ETA: ' + Math.ceil((REQUESTS_STATS.midRange * (listLen - REQUESTS_STATS.counter)) / 1000) + 's'
        + '\t' + targetPath);

    if (err) {
        //TODO implement logic: If errors are more then <25> then paused scanning
        if (err.code) {
            logger.clearAndLog(
                [new Date()],
                (err.code),
                '@@at', target,
                'after', ms, 'ms');
        }
        return;
    }
    const CODE = res.split('\r\n')[0];
    logger.clearAndLog(
        '(' + ++REQUESTS_STATS.founds + ')',
        [new Date()],
        target, '=>', CODE);
}

/**
 * Start dictionary attack with given list.
 * @param {Object} options - The object options
 * @param {string} options.target - target host.
 * @param {string[]} options.list - The list of string to use.
 * @param {string[]} options.extensions - The list of extensions to combinate.
 * @param {string[]} [options.dns] - The list of dns to use.
 * @param {string} [options.proxy] - The used proxy. The form must be the follow (Ex: http://proxyIp:proxyPort).
 * @param {string} [options.ignoreResponseWith] - The string to ignore on response received. If response contains given parameter, then will be ignored.
 * @param {Logger} options.logger - logger instance.
 * @param {boolean} asyncRequests - Starting attack in async way. As Default false
 * @returns {Promise<Array>}
 */
async function startDicAttack(options, asyncRequests = false) {
    const {list, extensions, target, dns, proxy, logger, ignoreResponseWith} = options;
    const CONCURRENCY_LIMIT = 1000; //TODO make this maybe as parameter
    const listLen = list.length * extensions.length;
    const listArguments = [];
    let results = [];

    for (let string of list) {
        for (let ext of extensions) {
            const targetPath = string + ext;
            const requestOptions = {
                target,
                path: targetPath,
                dns, ignoreResponseWith,
                proxy: proxy,
                onResponse: function (err, res) {
                    onResponse(err, res, {targetPath, listLen, logger});
                }
            };

            if (!asyncRequests) {
                //make request in a sync-way
                results.push(await makeAndLogReq(requestOptions));
            } else {
                //else push option object to map async later
                listArguments.push(requestOptions);
            }
        }
    }

    if (asyncRequests) {
        return await parallelPromises(listArguments, makeAndLogReq, CONCURRENCY_LIMIT);
    } else {
        return results;
    }
}

module.exports = startDicAttack;