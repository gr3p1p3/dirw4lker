/**
 * Parallelize a maximal numbers of async-executions.
 * @param listArguments - List of arguments for each call.
 * @param asyncCallback - The async function to send parallel
 * @param CONCURRENCY_LIMIT - How many max. parallel concurrency.
 * @returns {Promise<>}
 */
async function parallelPromises(listArguments, asyncCallback, CONCURRENCY_LIMIT) {
    //make requests in a async-way avoiding problems of concurrency limit
    let results = [];
    const batchesCount = Math.ceil(listArguments.length / CONCURRENCY_LIMIT);
    for (let i = 0; i < batchesCount; i++) {
        const batchStart = i * CONCURRENCY_LIMIT;
        const batchArgs = listArguments.slice(batchStart, batchStart + CONCURRENCY_LIMIT);
        const batchPromises = batchArgs.map(asyncCallback);

        results = [...results, ...await Promise.all(batchPromises)];
    }
    return results;
}

async function take3subtake1part1(listOfArguments, asyncCallback, CONCURRENCY_LIMIT) {
    // Enhance arguments array to have an index of the argument at hand
    const argsCopy = listOfArguments.map((val, ind) => ({val, ind}));
    const result = new Array(listOfArguments.length);
    const promises = new Array(CONCURRENCY_LIMIT).fill(Promise.resolve());

    // Recursively chain the next Promise to the currently executed Promise
    function chainNext(singlePromise) {
        if (argsCopy.length) {
            const arg = argsCopy.shift();
            return singlePromise
                .then(function () {
                    // Store the result into the array upon Promise completion
                    const operationPromise = asyncCallback(arg.val)
                        .then(function (r) {
                            result[arg.ind] = r;
                        });
                    return chainNext(operationPromise);
                });
        }
        return singlePromise;
    }

    await Promise.all(promises.map(chainNext));
    return result;
}

module.exports = parallelPromises;