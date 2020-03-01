const makeAndLogReq = require('./makeAndLogReq');

/**
 * Start dictionary attack with given list.
 * @param {Object} options - The object options
 * @param {string} options.target - target host.
 * @param {string[]} options.list - The list of string to use.
 * @param {string[]} options.extensions - The list of extensions to combinate.
 * @param {string[]} [options.dns] - The list of dns to use.
 * @param {string} [options.ignoreResponseWith] - The string to ignore on response received. If response contains given parameter, then will be ignored.
 * @param {Logger} options.logger - logger instance.
 * @param {boolean} asyncRequests - Starting attack in async way. As Default false
 * @returns {Promise<Array>}
 */
async function startDicAttack(options, asyncRequests = false) {
    const {list, extensions, target, dns, logger, ignoreResponseWith} = options;
    const listLen = list.length * extensions.length;
    let requestsCounter = 0;
    const listArguments = [];
    let results = [];

    //TODO: batch parallel async requests to improve performance without having problem of concurrent parallel connections
    for (let string of list) {
        for (let ext of extensions) {
            const targetPath = string + ext;

            const requestOptions = {
                target,
                path: targetPath,
                dns, ignoreResponseWith,
                onResponse: function onResponse(erroredResult, foundResult) {
                    const {target, ms, res, err} = foundResult || erroredResult;

                    requestsCounter++;
                    const percent = requestsCounter / listLen * 100;
                    logger.overwriteLastLine(percent.toFixed(0) + '%' + '\t' + requestsCounter + '/' + listLen + '\t' + targetPath);

                    if (err) {
                        //TODO implement logic: If errors are more then <25> then paused scanning
                        if (err.code) {
                            logger.clearAndLog((err.code), '@@at', target, 'after', ms, 'ms');
                        }
                        return;
                    }
                    const CODE = res.split('\r\n')[0];
                    logger.clearAndLog([new Date()], target, '=>', CODE);
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
        //make requests in a async-way
        results = listArguments.map(makeAndLogReq);
    }
    return (asyncRequests) ? await Promise.all(results) : results; //resolving all
}

module.exports = startDicAttack;