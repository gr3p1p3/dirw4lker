#!/usr/bin/env node
const parseArg = require('./util/parseArguments');
const dirWalker = require('./index');

const config = parseArg(process.argv.slice(2));
config.verbose = true;

console.time('Time');
return dirWalker.launch(config)
    .then(function (result) {
        console.log('\nFOUNDS:', result.founds.length, '/', result.sent);
        console.timeEnd('Time');
    })
    .catch(function (err) {
        console.log(err.message);
        console.timeEnd('Time');
        process.exit();
    });