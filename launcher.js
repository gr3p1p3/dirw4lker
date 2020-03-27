#!/usr/bin/env node
const parseArg = require('./util/parseArguments');
const dirWalker = require('./index');

const config = parseArg(process.argv.slice(2));
config.verbose = true;

console.time('Time');
(async function cliLauncher() {
    try {
        const result = await dirWalker.launch(config);
        console.log('\nFOUNDS:', result.founds.length, '/', result.sent);
        console.timeEnd('Time');
    } catch (err) {
        console.log('\n' + err.message);
        console.timeEnd('Time');
        process.exit();
    }
})();
