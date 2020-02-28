#!/usr/bin/env node
const parseArg = require('./util/parseArguments');
const dirWalker = require('./lib');

const config = parseArg(process.argv.slice(2));
config.verbose = true;

console.time('Time');
return dirWalker.launch(config)
    .then(function (founds) {
        console.log('\nFOUNDS:', founds.length);
        console.timeEnd('Time');
    })
    .catch(function (err) {
        console.log(err.message);
        console.timeEnd('Time');
    });