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
 * @param {Array<string>} extensions - The list of extensions to combinate.
 * @returns {Promise<void>}
 */
async function launcher(list, extensions) {
    let requestsCounter = 0;
    for (let string of list) {
        for (let ext of extensions) {
            requestsCounter++;
            const targetPath = string + ext;
            if (!LIMIT || requestsCounter < LIMIT) {
                const timerStart = new Date();
                await makeAndLogReq(targetPath, {
                    target: TARGET_HOST,
                    // injectPayload: false,
                    dns: USE_DNS ? USE_DNS.split(',') : undefined
                });
                const time = new Date() - timerStart;
                console.log('TIME', time / 1000)
            } else {
                throw '\nLimit of ' + LIMIT + ' requests is reached!';
            }
        }
    }
}

function makeAndLogReq(path, config) {
    const target = config.target + '/' + path;
    config.target = target;

    return RequestAgent(config)
        .then(function filterResponse(responseString) {
            if (!responseString || responseString.match('404')) {
                // console.log('NOT FOUND FOR:', target);
            } else {
                const CODE = responseString.split('\r\n')[0];
                console.log([new Date()], target, '=>', CODE);
                // if (~CODE.indexOf(403)) {
                //     console.log(responseString);
                // }
            }
            return true;
        })
        .catch(function (err) {
            console.log((err.code || err), '@@at', target); //TODO implement logic: If errors are more then <25> then paused scanning
            return true;
        });
}

async function main(args) {
    const EXTENSIONS = ['/'];

    console.log(logWelcome);
    console.table(args);

    if (!args.host) {
        throw '--host parameter is not used or empty. Ex: --host=http://example.com/';
    }
    if (!args.listDir) {
        console.log('--listDir parameter is not used or empty. Using default list will not be really effective!');
        args.listDir = './lib/payloads/global.txt';
    }
    if (args.limit) {
        LIMIT = parseInt(args.limit);
        console.log('**WARNING** Requests will be maximal', LIMIT);
    }
    if (args.ext) {
        args.ext.split(',')
            .map(function (ext) {
                ext = (ext[0] !== '.') ? '.' + ext : ext;
                EXTENSIONS.push(ext);
            });
    }

    TARGET_HOST = args.host;
    USE_DNS = args.dns;
    // SAVE_LOGS = args.logs; //TODO implement this option, for saving logs
    const data = await readFile(args.listDir);
    //cleaning data
    const cleanedData = data.toString()
        .split('\n')
        .filter(function (string) {
            return string && string[0] !== '#';
        });
    // console.log('cleanedData', cleanedData.length); //TODO log info about total requestsToDo
    console.log('\n');
    return launcher(cleanedData, EXTENSIONS);
}

//execute all
let TARGET_HOST, USE_DNS, LIMIT, SAVE_LOGS;
return main(parseArg(process.argv.slice(2)))
    .catch(console.log);