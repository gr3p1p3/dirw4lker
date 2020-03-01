/**
 * Parallelize a maximal numbers of async-executions.
 * @param listArguments - List of arguments for each call.
 * @param asyncCallback - The async function to send parallel
 * @param CONCURRENCY_LIMIT - How many max. parallel concurrency.
 * @returns {Promise<>}
 */
function parallelPromises(listArguments, asyncCallback, CONCURRENCY_LIMIT) {
    //make requests in a async-way avoiding problems of concurrency limit
    const argsCopy = listArguments.slice();
    const promises = new Array(CONCURRENCY_LIMIT).fill(Promise.resolve());

    function chainNext(promise) {
        if (argsCopy.length) {
            const arg = argsCopy.shift();
            return promise
                .then(async function () {
                    const promiseOP = asyncCallback(arg);
                    return chainNext(promiseOP);
                });
        }
        return promise;
    }

    return Promise.all(promises.map(chainNext));
}

module.exports = parallelPromises;