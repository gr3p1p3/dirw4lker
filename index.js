#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const RequestAgent = require('./lib/RequestAgent');
const logWelcome = require('./util/welcome')();
const parseArg = require('./util/parseArguments');

/**
 * Start dictionary attack with given list.
 * @param {Array<string>} list - The list of string to use.
 * @returns {Promise<void>}
 */
async function launcher(list) {
    let counter = 0;
    const extensions = ['/', '.php', '.txt'];
    for (let string of list) {
        if (string && string[0] !== '#') {
            for (let ext of extensions) {
                counter++;
                const targetPath = string + ext;
                if (!LIMIT || counter < LIMIT) {
                    await makeAndLogReq(targetPath, {
                        target: TARGET_HOST,
                        // injectPayload: false,
                        dns: USE_DNS ? USE_DNS.split(',') : undefined
                    });
                } else {
                    throw '\nLimit of ' + LIMIT + ' requests!';
                }
            }
        }
    }
}

function makeAndLogReq(path, config) {
    const target = config.target + '/' + path;
    config.target = target;

    return RequestAgent(config)
        .then(function (responseString) {
            if (!responseString || responseString.match('404')) {
                // console.log('NOT FOUND FOR:', target);
            } else {
                const CODE = responseString.split('\r\n')[0];
                console.log([new Date()], target, '=>', CODE);
                // if (~CODE.indexOf(403)) {
                //     console.log(responseString);
                // }
            }
        })
        .catch(function (err) {
            console.log((err.code || err), '@@at', target);
        });
}

async function main() {
    const args = parseArg(process.argv.slice(2));
    console.log(logWelcome);
    console.table(args);
    console.log('\n');

    if (!args.host) {
        throw '--host parameter is not used or empty. Ex: --host=http://example.com/';
    }
    if (!args.listDir) {
        throw '--listDir parameter is not used or empty.';
    }
    if (args.limit) {
        LIMIT = parseInt(args.limit);
        console.log('**WARNING** Requests will be maximal', LIMIT)
    }

    TARGET_HOST = args.host;
    USE_DNS = args.dns;
    // SAVE_LOGS = args.logs; //TODO implement this option
    const data = await readFile(args.listDir);
    return launcher(data.toString().split('\n'));
}

//execute all
let TARGET_HOST, USE_DNS, LIMIT, SAVE_LOGS;
return main()
    .catch(console.log);
